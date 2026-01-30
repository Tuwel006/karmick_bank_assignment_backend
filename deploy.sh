#!/bin/bash

# Deployment script for EC2 with PM2
# This script handles building and deploying the NestJS microservices

set -e

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed. Installing PM2 globally...${NC}"
    npm install -g pm2
fi

# Create logs directory if it doesn't exist
echo -e "${GREEN}📁 Creating logs directory...${NC}"
mkdir -p logs

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install --production=false

# Build the application
echo -e "${GREEN}🔨 Building the application...${NC}"
npm run build

# Stop existing PM2 processes
echo -e "${YELLOW}🛑 Stopping existing PM2 processes...${NC}"
pm2 delete all || true

# Start all services with PM2
echo -e "${GREEN}🚀 Starting all services with PM2...${NC}"
pm2 start ecosystem.config.js

# Save PM2 process list
echo -e "${GREEN}💾 Saving PM2 process list...${NC}"
pm2 save

# Setup PM2 to start on system boot
echo -e "${GREEN}⚙️  Setting up PM2 startup script...${NC}"
pm2 startup || echo -e "${YELLOW}⚠️  Please run the command shown above with sudo to enable PM2 on system startup${NC}"

# Show PM2 status
echo -e "${GREEN}✅ Deployment complete! Here's the status:${NC}"
pm2 status

echo ""
echo -e "${GREEN}📊 Useful PM2 commands:${NC}"
echo "  pm2 status          - Show status of all processes"
echo "  pm2 logs            - Show logs for all processes"
echo "  pm2 logs <app-name> - Show logs for specific service"
echo "  pm2 restart all     - Restart all services"
echo "  pm2 stop all        - Stop all services"
echo "  pm2 delete all      - Delete all processes"
echo "  pm2 monit           - Monitor all processes in real-time"
