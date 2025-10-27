#!/bin/bash

# Production deployment script for Pure Bhakti Base with Let's Encrypt SSL

echo "Starting production deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if Let's Encrypt certificates exist
if [ ! -f "$HOME/pbb-certs/letsencrypt/live/purebhaktibase.com/fullchain.pem" ]; then
    echo "ERROR: Let's Encrypt certificates not found at:"
    echo "  $HOME/pbb-certs/letsencrypt/live/purebhaktibase.com/fullchain.pem"
    echo "  $HOME/pbb-certs/letsencrypt/live/purebhaktibase.com/privkey.pem"
    echo ""
    echo "Please ensure your certificates are in the correct location."
    exit 1
fi

echo "Let's Encrypt certificates found. Proceeding with deployment..."

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start services
echo "Building and starting services with SSL..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if nginx is running properly
if docker ps | grep -q "nginx-ssl-prod"; then
    echo "Production deployment completed successfully!"
    echo "Your site should now be available at:"
    echo "  - https://purebhaktibase.com"
    echo "  - https://www.purebhaktibase.com"
    echo ""
    echo "To check SSL certificate status, run:"
    echo "  openssl s_client -connect purebhaktibase.com:443 -servername purebhaktibase.com < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A 3 'Issuer:'"
else
    echo "ERROR: nginx-ssl container failed to start. Check logs:"
    echo "  docker logs nginx-ssl-prod"
    exit 1
fi