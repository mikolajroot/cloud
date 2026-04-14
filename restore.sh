#!/bin/bash

if [ -z "$1" ]; then
  echo "Użycie: ./restore.sh <nazwa_pliku.tar.gz>"
  exit 1
fi

docker stop postgres

docker run --rm \
  -v postgres_data:/volume_data \
  -v "$(pwd):/backup_dir" \
  alpine sh -c "rm -rf /volume_data/* && tar -xzvf /backup_dir/$1 -C /volume_data"


docker start postgres

sleep 3

docker exec postgres pg_isready -U postgres