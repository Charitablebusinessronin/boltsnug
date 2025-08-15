# Snugs & Kisses Healthcare Platform - Docker Configuration
# Multi-stage build for optimized production deployment

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build arguments for environment configuration
ARG VITE_CATALYST_PROJECT_ID
ARG VITE_ENVIRONMENT=production
ARG VITE_CATALYST_APP_URL
ARG VITE_APP_NAME="Snugs & Kisses Healthcare Platform"
ARG VITE_APP_VERSION=1.0.0

# Set environment variables for build
ENV VITE_CATALYST_PROJECT_ID=$VITE_CATALYST_PROJECT_ID
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_CATALYST_APP_URL=$VITE_CATALYST_APP_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy custom nginx configuration for healthcare platform
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy healthcare platform assets
COPY --from=builder /app/public /usr/share/nginx/html

# Create healthcare platform directories
RUN mkdir -p /var/log/nginx/healthcare && \
    chown -R nginx:nginx /var/log/nginx/healthcare && \
    chmod -R 755 /var/log/nginx/healthcare

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Security: Run as non-root user
USER nginx

# Expose port 80 for healthcare platform
EXPOSE 80

# Labels for healthcare platform identification
LABEL maintainer="healthcare-team@snugsandkisses.com"
LABEL version="1.0.0"
LABEL description="Snugs & Kisses Healthcare Authentication Portal"
LABEL org.opencontainers.image.title="Snugs & Kisses Healthcare Platform"
LABEL org.opencontainers.image.description="Postpartum care platform login gateway"
LABEL org.opencontainers.image.vendor="Snugs & Kisses Healthcare"
LABEL org.opencontainers.image.version="1.0.0"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]