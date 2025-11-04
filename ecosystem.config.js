module.exports = {
  apps: [{
    name: 'wedding-backend',
    cwd: '/var/www/wedding-backend/backend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/wedding-backend-error.log',
    out_file: '/var/log/pm2/wedding-backend-out.log',
    log_file: '/var/log/pm2/wedding-backend-combined.log',
    time: true
  }]
};
