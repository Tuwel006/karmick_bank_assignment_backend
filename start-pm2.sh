#!/bin/bash

# Quick start script for local development with PM2
# This allows you to test PM2 configuration locally before deploying to EC2

set -e

echo "🚀 Starting local PM2 development environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed. Installing PM2 globally...${NC}"
    npm install -g pm2
fi

# Create logs directory
mkdir -p logs

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the application
echo -e "${GREEN}🔨 Building the application...${NC}"
npm run build

# Stop existing PM2 processes
echo -e "${YELLOW}🛑 Stopping existing PM2 processes...${NC}"
pm2 delete all || true

# Start all services with PM2
echo -e "${GREEN}🚀 Starting all services with PM2...${NC}"
pm2 start ecosystem.config.js

# Show status
echo -e "${GREEN}✅ All services started! Here's the status:${NC}"
pm2 status

echo ""
echo -e "${GREEN}📊 Useful commands:${NC}"
echo "  pm2 logs            - View all logs"
echo "  pm2 monit           - Monitor processes"
echo "  pm2 restart all     - Restart all services"
echo "  pm2 stop all        - Stop all services"
echo "  pm2 delete all      - Delete all processes"
