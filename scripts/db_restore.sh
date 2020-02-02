#!/usr/bin/env sh
# Usage: ./db_restore.sh <path_to_some_pg_restore_dump>
# Ignore the "schema public already exists" error.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"

PG_SERVICE="postgres"
PG_CONTAINER="spotify-my-slack_postgres_1"
PG_DB="spotify_my_slack"

cd "$SCRIPT_DIR/.."
docker-compose up -d "$PG_SERVICE"

docker exec -i "$PG_CONTAINER" \
    dropdb --if-exists --username=postgres "$PG_DB"
docker exec -i "$PG_CONTAINER" \
    createdb --username=postgres "$PG_DB"
docker exec -i "$PG_CONTAINER" \
    pg_restore --dbname="$PG_DB" --no-acl --no-owner --username=postgres \
    < "$1"
echo "Done"
