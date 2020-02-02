#!/usr/bin/env sh
# Usage: ./db_connect.sh

PG_CONTAINER="spotify-my-slack_postgres_1"
PG_SERVICE="postgres"
PG_DB="spotify_my_slack"

docker-compose up -d "$PG_SERVICE"
docker exec -it "$PG_CONTAINER" \
    psql -U postgres "$PG_DB"
