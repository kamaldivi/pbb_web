#!/bin/bash

# Let's Encrypt certificate renewal script for Pure Bhakti Base
# This script should be run periodically (e.g., via cron) to renew certificates

echo "Starting certificate renewal process..."

# Navigate to project directory
cd "$(dirname "$0")"

echo "NOTE: This project uses externally managed certificates from:"
echo "  ~/pbb-certs/letsencrypt/live/purebhaktibase.com/"
echo ""
echo "To renew certificates, use your external certificate management process."
echo "After renewal, restart nginx to pick up new certificates:"
echo ""
echo "  docker-compose -f docker-compose.prod.yml restart nginx-ssl"
echo ""
echo "Certificate renewal process information displayed."