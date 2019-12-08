#!/usr/bin/env sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"

cd "$SCRIPT_DIR/../server"
npm install --only=prod && npm install --only=dev
npm run build
./node_modules/.bin/sequelize db:migrate
