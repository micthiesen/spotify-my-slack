#!/usr/bin/env sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"
export CI=true

# Run global linting defined in the root package.json
npm run lint

printf "\nTesting the client...\n"
cd "$SCRIPT_DIR/../client"
npm install --only=prod && npm install --only=dev
npm run lint
npm test

printf "\nTesting the server...\n"
cd "$SCRIPT_DIR/../server"
npm install --only=prod && npm install --only=dev
npm run lint
# npm test
