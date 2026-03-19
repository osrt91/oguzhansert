module.exports = {
  apps: [
    {
      name: "oguzhansert",
      script: "node_modules/.bin/next",
      args: "start -p 3005",
      cwd: "/opt/oguzhansert",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
      },
      max_memory_restart: "300M",
      instances: 1,
      autorestart: true,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/opt/oguzhansert/logs/error.log",
      out_file: "/opt/oguzhansert/logs/out.log",
      merge_logs: true,
    },
  ],
};
