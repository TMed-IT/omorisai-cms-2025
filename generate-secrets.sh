#!/bin/bash

if [ ! -f .env.example ]; then
    echo "Error: .env.example file not found."
    exit 1
fi

if [ -f .env ]; then
    echo "Updating secrets in existing .env file..."
else
    echo "Creating new .env file..."
fi

echo "Generating secrets..."

PAYLOAD_SECRET=$(openssl rand -base64 64 | tr -d '\n')
CRON_SECRET=$(openssl rand -base64 32 | tr -d '\n')
PREVIEW_SECRET=$(openssl rand -base64 32 | tr -d '\n')

cp .env.example .env

sed -i.bak "s/PAYLOAD_SECRET=YOUR_SECRET_HERE/PAYLOAD_SECRET=${PAYLOAD_SECRET}/" .env
sed -i.bak "s/CRON_SECRET=YOUR_CRON_SECRET_HERE/CRON_SECRET=${CRON_SECRET}/" .env
sed -i.bak "s/PREVIEW_SECRET=YOUR_SECRET_HERE/PREVIEW_SECRET=${PREVIEW_SECRET}/" .env

rm -f .env.bak

echo ".env file has been successfully updated!"
echo ""
echo "Generated secrets:"
echo "- PAYLOAD_SECRET: ${PAYLOAD_SECRET:0:20}..."
echo "- CRON_SECRET: ${CRON_SECRET:0:20}..."
echo "- PREVIEW_SECRET: ${PREVIEW_SECRET:0:20}..."
echo ""
echo "Note: Please use proper secret management in production environment." 