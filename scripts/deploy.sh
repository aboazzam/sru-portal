#!/bin/bash
# Run on VPS to update the app: bash /var/www/sru-portal/scripts/deploy.sh
set -e

APP_DIR="/var/www/sru-portal"
cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Building Next.js app..."
npm run build

echo "==> Restarting app with PM2..."
pm2 restart sru-portal || pm2 start ecosystem.config.cjs

echo "==> Done."
pm2 status
