# SSL Certificate Management - Quick Reference

## 🔐 Certificate Status
- **Domain:** purebhaktibase.com
- **Expires:** March 10, 2026
- **Days Remaining:** 90 days ✅
- **Action Required:** None (automatically renewed)

## 🚀 Quick Renewal

```bash
# Test renewal first (recommended)
cd ~/pbb-certs/hooks
./renew-cert.sh --dry-run

# Actual renewal
./renew-cert.sh
```

## 📍 Certificate Location
Shared certificates are located at:
```
~/pbb-certs/letsencrypt/live/purebhaktibase.com/
```

Both **pbb_web** (frontend) and **pure_bhakti_apis** (backend) use the same certificates.

## 📚 Full Documentation
See: `~/pbb-certs/README.md` for complete instructions

## 🔧 Projects Sharing This Certificate

1. **Web Frontend** (this project)
   - Container: `nginx-ssl-prod`
   - Config: `nginx/nginx-ssl.conf`

2. **API Backend**
   - Location: `/Users/kamaldivi/Development/Python/pure_bhakti_apis`
   - Container: `pure_bhakti_apis-nginx-1`

## ⚡ Manual Nginx Reload (if needed)

```bash
# Reload web project nginx
docker kill -s HUP nginx-ssl-prod

# OR restart completely
docker restart nginx-ssl-prod
```

## ✅ Verify After Renewal

```bash
# Check certificate dates
openssl x509 -in ~/pbb-certs/letsencrypt/live/purebhaktibase.com/fullchain.pem -noout -dates

# Test website
curl -I https://purebhaktibase.com
```

---
**Last Updated:** December 10, 2025
**Last Renewal:** December 10, 2025
