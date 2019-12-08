#!/usr/bin/env sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"

# Run global tests defined in the root package.json
npm-run-all test:*

echo "Testing the client..."
cd "$SCRIPT_DIR/../client"
npm install
npm test

echo "Testing the server..."
cd "$SCRIPT_DIR/../server"
# npm install
# npm test
