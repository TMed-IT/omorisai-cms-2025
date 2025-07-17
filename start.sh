#!/bin/bash

if ! command -v tput &> /dev/null; then
  echo "tput command is required. Please install it."
  exit 1
fi

OPTIONS=(
  "Development"
  "Production"
  "Exit"
)

select_option() {
  local selected=0
  while true; do
    clear
    echo "Select environment to start (Use ↑↓ to move, Enter to confirm)"
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
    docker-compose up -d
    ;;
  1)
    echo "Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d --build
    ;;
  *)
    echo "Exiting."
    exit 0
    ;;
esac 