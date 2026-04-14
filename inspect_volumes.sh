#!/bin/bash

VOLUMES=("postgres_data" "backend_data")

for VOL in "${VOLUMES[@]}"; do

  
  LOCATION=$(docker volume inspect "$VOL" --format '{{.Mountpoint}}')
  echo "Lokalizacja hosta: $LOCATION"
  
  SIZE=$(docker run --rm -v "$VOL":/data alpine du -sh /data | cut -f1)
  echo "Rozmiar danych: $SIZE"
  

  CONTAINERS=$(docker ps -a --filter volume=$VOL --format "{{.Names}}")
  if [ -z "$CONTAINERS" ]; then
    echo "odłączone kontenery: BRAK"
  else
    CONTAINERS_FORMATTED=$(echo "$CONTAINERS" | tr '\n' ', ' | sed 's/, $//')
    echo "Podłączone kontenery: $CONTAINERS_FORMATTED"
  fi
done
