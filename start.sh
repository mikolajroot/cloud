#!/bin/bash

REGISTRY="mikolajroot"

docker rm -f nginx backend_1 backend_2 worker redis postgres 2>/dev/null || true
docker network rm proxy-net app-net db-net 2>/dev/null || true

docker network create --driver bridge --subnet=172.18.0.0/16 --gateway=172.18.0.1 proxy-net
docker network create --driver bridge --subnet=172.19.0.0/16 --gateway=172.19.0.1 app-net
docker network create --driver bridge --subnet=172.20.0.0/16 --gateway=172.20.0.1 db-net

docker volume create postgres_data 2>/dev/null || true
docker volume create backend_data 2>/dev/null || true


docker run -d \
  --name postgres \
  --network db-net \
  --ip 172.20.0.10 \
  --mac-address 02:42:ac:14:00:0a \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=product_db \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:18-alpine


docker run -d \
  --name redis \
  --network app-net \
  --tmpfs /data \
  redis:8-alpine


sleep 3
docker run -d --name backend_1 --network proxy-net \
  --ip 172.18.0.11 \
  -e PORT=3000 -e PGHOST=postgres -e PGPASSWORD=password -e REDIS_HOST=redis \
  -v backend_data:/app/persistent_data --tmpfs /app/tmp_data \
  ${REGISTRY}/backend:v2
docker network connect app-net backend_1
docker network connect db-net backend_1

docker run -d --name backend_2 --network proxy-net \
  --ip 172.18.0.12 \
  -e PORT=3001 -e PGHOST=postgres -e PGPASSWORD=password -e REDIS_HOST=redis \
  -v backend_data:/app/persistent_data --tmpfs /app/tmp_data \
  ${REGISTRY}/backend:v2
docker network connect app-net backend_2
docker network connect db-net backend_2

docker run -d --name worker --network app-net \
  -e PGHOST=postgres -e PGPASSWORD=password -e REDIS_HOST=redis \
  ${REGISTRY}/backend:v2 node -e "setInterval(() => console.log('Worker is live...'), 5000);"
docker network connect db-net worker


docker run -d \
  --name nginx \
  --network proxy-net \
  -p 80:8080 \
  -v "$(pwd)/frontend_src:/usr/share/nginx/html:ro" \
  ${REGISTRY}/frontend:v2

