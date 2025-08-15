#!/bin/bash
# Snugs & Kisses Healthcare Platform - Deployment Script
# Automated Docker deployment for healthcare platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Healthcare platform configuration
PROJECT_NAME="snugs-healthcare"
IMAGE_NAME="snugs-healthcare-portal"
CONTAINER_NAME="snugs-healthcare-portal"

echo -e "${BLUE}🏥 Snugs & Kisses Healthcare Platform Deployment${NC}"
echo "================================================="

# Check if environment file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}Please update .env with your healthcare platform configuration${NC}"
    else
        echo -e "${RED}❌ Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Validate required environment variables for healthcare platform
echo -e "${BLUE}🔍 Validating healthcare platform configuration...${NC}"
REQUIRED_VARS=("VITE_CATALYST_PROJECT_ID" "VITE_CATALYST_APP_URL")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Error: Required environment variable $var is not set${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $var is configured${NC}"
    fi
done

# Build healthcare platform image
echo -e "${BLUE}🏗️  Building healthcare platform Docker image...${NC}"
docker build \
    --build-arg VITE_CATALYST_PROJECT_ID="${VITE_CATALYST_PROJECT_ID}" \
    --build-arg VITE_ENVIRONMENT="${VITE_ENVIRONMENT:-production}" \
    --build-arg VITE_CATALYST_APP_URL="${VITE_CATALYST_APP_URL}" \
    -t ${IMAGE_NAME}:latest \
    -t ${IMAGE_NAME}:$(date +%Y%m%d%H%M%S) \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Healthcare platform image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build healthcare platform image${NC}"
    exit 1
fi

# Stop existing container if running
echo -e "${BLUE}🛑 Stopping existing healthcare platform container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Deploy healthcare platform with Docker Compose
echo -e "${BLUE}🚀 Deploying healthcare platform...${NC}"
docker-compose up -d

# Wait for health check
echo -e "${BLUE}🏥 Waiting for healthcare platform to be healthy...${NC}"
for i in {1..30}; do
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Healthcare platform is healthy and ready${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Waiting for healthcare platform... (attempt $i/30)${NC}"
        sleep 2
    fi
done

# Check if deployment was successful
if curl -f http://localhost/health >/dev/null 2>&1; then
    echo -e "${GREEN}🎉 Healthcare platform deployed successfully!${NC}"
    echo ""
    echo "Healthcare Portal URL: http://localhost"
    echo "Health Check: http://localhost/health"
    echo ""
    echo "To view logs: docker-compose logs -f healthcare-portal"
    echo "To stop: docker-compose down"
else
    echo -e "${RED}❌ Healthcare platform deployment failed${NC}"
    echo "Check logs with: docker-compose logs healthcare-portal"
    exit 1
fi