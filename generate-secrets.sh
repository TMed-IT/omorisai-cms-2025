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

PAYLOAD_SECRET=$(openssl rand -base64 64 | tr -d '\n' | tr -d '+/' | tr '=' 'A')
CRON_SECRET=$(openssl rand -base64 32 | tr -d '\n' | tr -d '+/' | tr '=' 'A')
PREVIEW_SECRET=$(openssl rand -base64 32 | tr -d '\n' | tr -d '+/' | tr '=' 'A')
USERS_API_SECRET=$(openssl rand -base64 32 | tr -d '\n' | tr -d '+/' | tr '=' 'A')

cp .env.example .env

sed -i.bak "s|PAYLOAD_SECRET=YOUR_SECRET_HERE|PAYLOAD_SECRET=${PAYLOAD_SECRET}|" .env
sed -i.bak "s|CRON_SECRET=YOUR_CRON_SECRET_HERE|CRON_SECRET=${CRON_SECRET}|" .env
sed -i.bak "s|PREVIEW_SECRET=YOUR_SECRET_HERE|PREVIEW_SECRET=${PREVIEW_SECRET}|" .env
sed -i.bak "s|USERS_API_SECRET=YOUR_USERS_API_SECRET_HERE|USERS_API_SECRET=${USERS_API_SECRET}|" .env

rm -f .env.bak

echo ".env file has been successfully updated!"
echo ""
echo "Generated secrets:"
echo "- PAYLOAD_SECRET: ${PAYLOAD_SECRET:0:20}..."
echo "- CRON_SECRET: ${CRON_SECRET:0:20}..."
echo "- PREVIEW_SECRET: ${PREVIEW_SECRET:0:20}..."
echo "- USERS_API_SECRET: ${USERS_API_SECRET:0:20}..."
echo ""
echo "Note: Please use proper secret management in production environment." 