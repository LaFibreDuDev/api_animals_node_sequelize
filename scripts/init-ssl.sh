#!/bin/sh
# First-time SSL certificate setup using Let's Encrypt.
#
# Usage:
#   DOMAIN=api.example.com ACME_EMAIL=you@example.com sh scripts/init-ssl.sh
#
# This script solves the chicken-and-egg problem:
#   - nginx needs a certificate to start
#   - certbot needs nginx running to complete the HTTP challenge
#
# Solution: create a temporary self-signed cert so nginx can start,
# then replace it immediately with the real Let's Encrypt certificate.

set -e

: "${DOMAIN:?Variable DOMAIN is required}"
: "${ACME_EMAIL:?Variable ACME_EMAIL is required}"

echo "[1/4] Creating temporary self-signed certificate..."
docker compose run --rm --entrypoint "/bin/sh" certbot -c "
  mkdir -p /etc/letsencrypt/live/${DOMAIN} && \
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/${DOMAIN}/privkey.pem \
    -out  /etc/letsencrypt/live/${DOMAIN}/fullchain.pem \
    -subj '/CN=localhost' 2>/dev/null
"

echo "[2/4] Starting nginx with temporary certificate..."
docker compose up -d nginx
sleep 3

echo "[3/4] Requesting certificate from Let's Encrypt for ${DOMAIN}..."
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  --domain "$DOMAIN" \
  --email "$ACME_EMAIL" \
  --agree-tos \
  --non-interactive \
  --force-renewal

echo "[4/4] Reloading nginx with the real certificate..."
docker compose exec nginx nginx -s reload

echo ""
echo "SSL certificate obtained successfully."
echo "Run 'docker compose up -d' to start all services."
