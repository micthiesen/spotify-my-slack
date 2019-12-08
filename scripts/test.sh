#!/usr/bin/env sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"
export CI=true

# Run global tests defined in the root package.json
npm-run-all test:*

printf "\nTesting the client...\n"
cd "$SCRIPT_DIR/../client"
npm install
npm test

printf "\nTesting the server...\n"
cd "$SCRIPT_DIR/../server"
# npm install
# npm test
