#!/bin/bash
set -e

DB_FILE="server/storage/anythingllm.db"
if [ ! -f "$DB_FILE" ]; then
  mkdir -p "$(dirname "$DB_FILE")"
  touch "$DB_FILE"
fi

pushd docker >/dev/null
[ -f .env ] || cp .env.example .env
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d --build
else
  docker compose up -d --build
fi
popd >/dev/null
