module.exports = {
  apps: [
    {
      name: 'innerview-escola',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        watch: true
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      log_type: 'json',
      time: true,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '5s',
      listen_timeout: 10000,
      kill_timeout: 3000,
      wait_ready: true,
      ready_timeout: 10000,
      stop_signal: 'SIGTERM',
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      watch: ['server.js', 'next.config.js'],
      ignore_watch: ['node_modules', 'logs', '*.test.js'],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
};
