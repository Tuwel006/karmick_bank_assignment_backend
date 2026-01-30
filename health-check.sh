#!/bin/bash

# Health check script for all microservices
# This script checks if all services are running and responding

echo "🏥 Running health check for all services..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check if a port is listening
check_port() {
    local port=$1
    local service=$2
    
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $service (Port $port) - Running"
        return 0
    else
        echo -e "${RED}✗${NC} $service (Port $port) - Not responding"
        return 1
    fi
}

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local service=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|404\|401"; then
        echo -e "${GREEN}✓${NC} $service - HTTP responding"
        return 0
    else
        echo -e "${RED}✗${NC} $service - HTTP not responding"
        return 1
    fi
}

# Check if netcat is installed
if ! command -v nc &> /dev/null; then
    echo -e "${YELLOW}⚠️  netcat (nc) is not installed. Installing...${NC}"
    sudo apt-get install -y netcat 2>/dev/null || sudo yum install -y nc 2>/dev/null
fi

# Check PM2 status
echo "📊 PM2 Process Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
echo ""

# Check individual services
echo "🔍 Service Port Check:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

failed=0

check_port 4000 "API Gateway" || ((failed++))
check_port 4001 "Accounts Service" || ((failed++))
check_port 4002 "Users Service" || ((failed++))
check_port 4003 "Auth Service" || ((failed++))

echo ""

# Check API Gateway HTTP endpoint
echo "🌐 HTTP Endpoint Check:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v curl &> /dev/null; then
    check_http "http://localhost:4000" "API Gateway"
else
    echo -e "${YELLOW}⚠️  curl not installed, skipping HTTP check${NC}"
fi

echo ""

# Summary
echo "📋 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}✗ $failed service(s) are not responding${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check PM2 logs: pm2 logs"
    echo "2. Restart failed services: pm2 restart <service-name>"
    echo "3. Check service-specific logs in ./logs/ directory"
    exit 1
fi
