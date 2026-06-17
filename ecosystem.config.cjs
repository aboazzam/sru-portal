module.exports = {
  apps: [
    {
      name: 'sru-portal',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/sru-portal',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
