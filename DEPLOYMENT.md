# EC2 Deployment Guide with PM2

This guide will help you deploy the Karmick Bank microservices application to an AWS EC2 instance using PM2.

## Prerequisites

### On Your Local Machine
- Git installed
- SSH access to your EC2 instance

### On EC2 Instance
- Ubuntu/Amazon Linux (recommended)
- Node.js 18+ installed
- npm installed
- Git installed

## Step 1: Prepare Your EC2 Instance

### 1.1 Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 1.2 Install Node.js (if not already installed)
```bash
# For Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.3 Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 1.4 Install Git (if not already installed)
```bash
sudo apt-get update
sudo apt-get install -y git
```

## Step 2: Clone and Setup Your Application

### 2.1 Clone the Repository
```bash
cd ~
git clone <your-repository-url>
cd karmick_bank_assignment_backend
```

### 2.2 Configure Environment Variables
Create or update the `.env` file with your production settings:

```bash
nano .env
```

Update the following variables:
```env
NODE_ENV=production

# API Gateway
API_GATEWAY_PORT=4000

# Services Ports
ACCOUNTS_SERVICE_PORT=4001
USERS_SERVICE_PORT=4002
AUTH_SERVICE_PORT=4003

# Database - Users Service
USERS_DB_HOST=your-db-host
USERS_DB_PORT=6543
USERS_DB_NAME=postgres
USERS_DB_USER=your-db-user
USERS_DB_POOL_MODE=transaction

# Global Database Config
DB_PASS=your-db-password

# JWT
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRY=7d
```

## Step 3: Deploy the Application

### 3.1 Run the Deployment Script
```bash
./deploy.sh
```

This script will:
- Install all dependencies
- Build the application
- Start all microservices with PM2
- Configure PM2 to restart on system reboot

### 3.2 Verify Deployment
```bash
pm2 status
```

You should see all 8 services running:
- api-gateway
- accounts-service
- users-service
- auth-service
- notification-service
- transactions-service
- customer-service
- migration-service

## Step 4: Configure Security Group

Make sure your EC2 Security Group allows inbound traffic on:
- Port 4000 (API Gateway) - from anywhere or specific IPs
- Port 22 (SSH) - from your IP only

You can configure this in the AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Edit Inbound Rules
4. Add rule: Custom TCP, Port 4000, Source: 0.0.0.0/0 (or your specific IP range)

## Step 5: Setup PM2 Startup on Boot

Run the command shown by PM2 (it will look like this):
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

Then save the PM2 process list:
```bash
pm2 save
```

## PM2 Management Commands

### View Status
```bash
pm2 status
```

### View Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs api-gateway

# Last 100 lines
pm2 logs --lines 100
```

### Restart Services
```bash
# All services
pm2 restart all

# Specific service
pm2 restart api-gateway
```

### Stop Services
```bash
# All services
pm2 stop all

# Specific service
pm2 stop api-gateway
```

### Monitor Services
```bash
pm2 monit
```

### Delete All Processes
```bash
pm2 delete all
```

## Updating Your Application

When you need to update your application:

```bash
# Pull latest changes
git pull origin main

# Run deployment script
./deploy.sh
```

## Troubleshooting

### Check if services are running
```bash
pm2 status
```

### View error logs
```bash
pm2 logs --err
```

### Check specific service logs
```bash
pm2 logs api-gateway
```

### Restart a failing service
```bash
pm2 restart api-gateway
```

### Check port usage
```bash
sudo netstat -tulpn | grep LISTEN
```

### Test API Gateway
```bash
curl http://localhost:4000/health
```

## Log Files

All logs are stored in the `logs/` directory:
- `<service-name>-out.log` - Standard output logs
- `<service-name>-error.log` - Error logs

## Performance Monitoring

### View real-time monitoring
```bash
pm2 monit
```

### View memory usage
```bash
pm2 list
```

## Nginx Setup (Optional)

If you want to use Nginx as a reverse proxy:

### Install Nginx
```bash
sudo apt-get install -y nginx
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Restart Nginx
```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## SSL/HTTPS Setup (Optional)

Use Let's Encrypt for free SSL certificates:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Backup and Restore

### Backup PM2 configuration
```bash
pm2 save
```

### Restore PM2 configuration
```bash
pm2 resurrect
```

## Support

For issues or questions, check:
- PM2 logs: `pm2 logs`
- Application logs: `./logs/`
- System logs: `journalctl -u pm2-ubuntu`
