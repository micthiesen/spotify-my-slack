#!/usr/bin/env sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"

echo "Building the client..."
cd "$SCRIPT_DIR/../client"
npm install --only=prod && npm install --only=dev
npm run build

echo "Building the server..."
cd "$SCRIPT_DIR/../server"
npm install --only=prod && npm install --only=dev
npm run build
