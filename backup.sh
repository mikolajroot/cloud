#!/bin/bash

BACKUP_FILE="pg_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

docker run --rm \
  -v postgres_data:/volume_data \
  -v "$(pwd):/backup_dir" \
  alpine tar -czvf /backup_dir/"$BACKUP_FILE" -C /volume_data .
