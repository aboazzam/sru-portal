#!/bin/bash
# Initial VPS setup — run once as root on Ubuntu 22/24
# bash setup-server.sh
set -e

DOMAIN="sru-portal.aboazzam.art"
APP_DIR="/var/www/sru-portal"
REPO="https://github.com/aboazzam/sru-portal.git"
NODE_VERSION="20"

echo "==> Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

echo "==> Installing PM2..."
npm install -g pm2

echo "==> Installing Nginx & Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx

echo "==> Cloning repository..."
mkdir -p /var/www
git clone "$REPO" "$APP_DIR"
cd "$APP_DIR"

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running migrations..."
npx prisma migrate deploy

echo "==> Building app..."
npm run build

echo "==> Writing Nginx config..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX'
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

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "==> Starting app with PM2..."
cd "$APP_DIR"
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup | tail -1 | bash

echo "==> Obtaining SSL certificate..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m your@email.com --redirect

echo "==> Setup complete! App running at https://$DOMAIN"
