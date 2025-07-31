#!/bin/bash

if [ ! -f .env ]; then
  echo ".env file not found."
  echo "Generating secrets and creating .env file..."
  if [ -f generate-secrets.sh ]; then
    ./generate-secrets.sh
  else
    echo "Error: generate-secrets.sh not found."
    exit 1
  fi
fi

if ! command -v tput &> /dev/null; then
  echo "tput command is required. Please install it."
  exit 1
fi

setup_environment() {
  local env_type=$1
  local server_url=""
  
  case $env_type in
    "Development")
      echo "Setting development environment URL..."
      if [ -f .env ]; then
        dev_url=$(grep "^DEV_SERVER_URL=" .env | cut -d'=' -f2)
        if [ -z "$dev_url" ]; then
          dev_url="http://localhost:3000"
        fi
      else
        dev_url="http://localhost:3000"
      fi
      echo "Development environment URL: $dev_url"
      server_url=$dev_url
      ;;
    "Production")
      echo "Setting production environment URL..."
      if [ -f .env ]; then
        prod_url=$(grep "^PROD_SERVER_URL=" .env | cut -d'=' -f2)
        if [ -z "$prod_url" ]; then
          echo "Production environment URL is not set"
          echo "Please set PROD_SERVER_URL in .env file"
          exit 1
        fi
      else
        echo "Production environment URL is not set"
        echo "Please set PROD_SERVER_URL in .env file"
        exit 1
      fi
      echo "Production environment URL: $prod_url"
      server_url=$prod_url
      ;;
  esac
  
  if grep -q "NEXT_PUBLIC_SERVER_URL" .env; then
    sed -i.bak "s|NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=$server_url|" .env
  else
    echo "NEXT_PUBLIC_SERVER_URL=$server_url" >> .env
  fi
  
  case $env_type in
    "Development")
      if grep -q "DEV_SERVER_URL" .env; then
        sed -i.bak "s|DEV_SERVER_URL=.*|DEV_SERVER_URL=$server_url|" .env
      else
        echo "DEV_SERVER_URL=$server_url" >> .env
      fi
      ;;
    "Production")
      if grep -q "PROD_SERVER_URL" .env; then
        sed -i.bak "s|PROD_SERVER_URL=.*|PROD_SERVER_URL=$server_url|" .env
      else
        echo "PROD_SERVER_URL=$server_url" >> .env
      fi
      ;;
  esac
  echo "Environment variables updated"
}

OPTIONS=(
  "Development"
  "Production"
  "No Cache Build"
  "Exit"
)

select_option() {
  local selected=0
  while true; do
    clear
    echo "Select environment to start (Use ↑↓ to move, Enter to confirm):"
    for i in "${!OPTIONS[@]}"; do
      if [[ $i -eq $selected ]]; then
        tput rev
        echo "> ${OPTIONS[$i]}"
        tput sgr0
      else
        echo "  ${OPTIONS[$i]}"
      fi
    done
    IFS= read -rsn1 key
    if [[ $key == $'\x1b' ]]; then
      IFS= read -rsn1 k1
      IFS= read -rsn1 k2
      if [[ $k1 == "[" ]]; then
        if [[ $k2 == "A" ]]; then
          ((selected--))
          if [[ $selected -lt 0 ]]; then selected=$((${#OPTIONS[@]}-1)); fi
        elif [[ $k2 == "B" ]]; then
          ((selected++))
          if [[ $selected -ge ${#OPTIONS[@]} ]]; then selected=0; fi
        fi
      fi
    elif [[ $key == "" ]]; then
      break
    fi
  done
  return $selected
}

select_option
choice=$?

case $choice in
  0)
    echo "Starting development environment..."
    setup_environment "Development"
    docker compose up -d
    ;;
  1)
    echo "Starting production environment..."
    setup_environment "Production"
    docker compose -f docker-compose.prod.yml up -d --build
    ;;
  2)
    echo "Starting development environment with no cache build..."
    setup_environment "Development"
    docker compose build --no-cache
    docker compose up -d
    ;;
  *)
    echo "Exiting."
    exit 0
    ;;
esac 