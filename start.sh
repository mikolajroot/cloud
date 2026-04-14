#!/bin/bash

REGISTRY="mikolajroot"

docker stop nginx backend redis postgres 2>/dev/null || true
docker rm nginx backend redis postgres 2>/dev/null || true

docker network create product-net 2>/dev/null || true

docker volume create postgres_data 2>/dev/null || true
docker volume create backend_data 2>/dev/null || true


docker run -d \
  --name postgres \
  --network product-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=product_db \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -p 5433:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:18-alpine


docker run -d \
  --name redis \
  --network product-net \
  -p 6379:6379 \
  --tmpfs /data \
  redis:8-alpine


sleep 3
docker run -d \
  --name backend \
  --network product-net \
  -e PORT=3000 \
  -e PGHOST=postgres \
  -e PGPASSWORD=password \
  -e REDIS_HOST=redis \
  -v backend_data:/app/persistent_data \
  --tmpfs /app/tmp_data \
  ${REGISTRY}/backend:v2


docker run -d \
  --name nginx \
  --network product-net \
  -p 8080:8080 \
  -v "$(pwd)/frontend_src:/usr/share/nginx/html:ro" \
  ${REGISTRY}/frontend:v2

