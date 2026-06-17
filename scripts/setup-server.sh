#!/bin/bash
# Initial VPS setup for AlmaLinux 9 — run once as root
# bash setup-server.sh
set -e

DOMAIN="sru-portal.aboazzam.art"
APP_DIR="/var/www/sru-portal"
REPO="https://github.com/aboazzam/sru-portal.git"
NODE_VERSION="20"
EMAIL="malmohaimeed@gmail.com"

echo "==> Updating system..."
dnf update -y
dnf install -y git curl

echo "==> Installing Node.js $NODE_VERSION..."
curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
dnf install -y nodejs

echo "==> Installing PM2..."
npm install -g pm2

echo "==> Installing Nginx..."
dnf install -y nginx
systemctl enable nginx
systemctl start nginx

echo "==> Installing Certbot..."
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx

echo "==> Opening firewall ports..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

echo "==> Allowing Nginx to proxy to backend (SELinux)..."
setsebool -P httpd_can_network_connect 1

echo "==> Cloning repository..."
mkdir -p /var/www
git clone "$REPO" "$APP_DIR"
cd "$APP_DIR"

echo "==> Creating .env file..."
cat > "$APP_DIR/.env" << 'ENVEOF'
DATABASE_URL="file:./dev.db"
SESSION_SECRET="q8ypqrzegF1FCL36M3ojU+WoPs47smWp9xzex2YJ+tQ="
JWT_SECRET="c7k2Lm9nPqRsTuVwXyZ0aB3dE5fG8hIjK1N4oQ6rS="
NODE_ENV=production
ENVEOF

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Building Next.js app..."
npm run build

echo "==> Writing Nginx config..."
cat > /etc/nginx/conf.d/$DOMAIN.conf << 'NGINX'
server {
    listen 80;
    server_name sru-portal.aboazzam.art;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

nginx -t && systemctl reload nginx

echo "==> Starting app with PM2..."
cd "$APP_DIR"
pm2 start ecosystem.config.cjs
pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "==> Obtaining SSL certificate..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

echo "==> Setup complete!"
echo "    App is live at: https://$DOMAIN"
pm2 status
