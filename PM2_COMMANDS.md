# PM2 Quick Reference Guide

## Starting Services

```bash
# Using the deployment script (recommended for first deployment)
./deploy.sh

# Using the quick start script (for local testing)
./start-pm2.sh

# Using npm scripts
npm run pm2:start

# Using PM2 directly
pm2 start ecosystem.config.js
```

## Monitoring & Logs

```bash
# View status of all services
pm2 status
# or
npm run pm2:status

# View logs for all services
pm2 logs
# or
npm run pm2:logs

# View logs for specific service
pm2 logs api-gateway

# View last N lines
pm2 logs --lines 100

# Real-time monitoring dashboard
pm2 monit
# or
npm run pm2:monit

# View error logs only
pm2 logs --err
```

## Managing Services

```bash
# Restart all services
pm2 restart all
# or
npm run pm2:restart

# Restart specific service
pm2 restart api-gateway

# Stop all services
pm2 stop all
# or
npm run pm2:stop

# Stop specific service
pm2 stop api-gateway

# Delete all processes
pm2 delete all
# or
npm run pm2:delete

# Delete specific service
pm2 delete api-gateway

# Reload (zero-downtime restart)
pm2 reload all
```

## Service Information

```bash
# Detailed info about a service
pm2 describe api-gateway

# Show process list
pm2 list

# Show process list in JSON
pm2 jlist
```

## Process Management

```bash
# Save current process list
pm2 save

# Resurrect previously saved processes
pm2 resurrect

# Setup PM2 to start on system boot
pm2 startup

# Disable startup script
pm2 unstartup
```

## Log Management

```bash
# Flush all logs
pm2 flush

# Reload all logs
pm2 reloadLogs
```

## Performance & Metrics

```bash
# Monitor CPU and memory
pm2 monit

# Show metrics
pm2 describe api-gateway

# Install PM2 web dashboard (optional)
pm2 install pm2-server-monit
```

## Scaling (for cluster mode)

```bash
# Scale to N instances
pm2 scale api-gateway 4

# Scale up by N
pm2 scale api-gateway +2

# Scale down by N
pm2 scale api-gateway -1
```

## Useful Combinations

```bash
# Restart and view logs
pm2 restart all && pm2 logs

# Stop all and delete
pm2 stop all && pm2 delete all

# Update app and restart
git pull && npm install && npm run build && pm2 restart all
```

## Environment-Specific Commands

```bash
# Start with specific environment
NODE_ENV=production pm2 start ecosystem.config.js

# Start with custom name
pm2 start dist/apps/api-gateway/main.js --name "my-api"

# Start with specific instances
pm2 start ecosystem.config.js --only api-gateway
```

## Troubleshooting

```bash
# Check if PM2 daemon is running
pm2 ping

# Kill PM2 daemon
pm2 kill

# Update PM2
npm install -g pm2@latest
pm2 update

# Clear PM2 dump
pm2 cleardump

# Reset all counters
pm2 reset all
```

## Service-Specific Commands

All your services:
- `api-gateway` (Port 4000)
- `accounts-service` (Port 4001)
- `users-service` (Port 4002)
- `auth-service` (Port 4003)
- `notification-service`
- `transactions-service`
- `customer-service`
- `migration-service`

Example for specific service:
```bash
pm2 restart api-gateway
pm2 logs api-gateway
pm2 describe api-gateway
```

## Log File Locations

All logs are stored in `./logs/` directory:
- `api-gateway-out.log` / `api-gateway-error.log`
- `accounts-service-out.log` / `accounts-service-error.log`
- `users-service-out.log` / `users-service-error.log`
- `auth-service-out.log` / `auth-service-error.log`
- `notification-service-out.log` / `notification-service-error.log`
- `transactions-service-out.log` / `transactions-service-error.log`
- `customer-service-out.log` / `customer-service-error.log`
- `migration-service-out.log` / `migration-service-error.log`

## Common Issues

### Service won't start
```bash
# Check logs
pm2 logs <service-name> --err

# Delete and restart
pm2 delete <service-name>
pm2 start ecosystem.config.js --only <service-name>
```

### Port already in use
```bash
# Find process using port
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>
```

### Out of memory
```bash
# Check memory usage
pm2 list

# Restart service
pm2 restart <service-name>
```
