#!/usr/bin/env bash

set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# build backend
cd backend
npm install
NODE_PATH="${DIR}/backend/node_modules" npm run build

# build frontend
cd ../frontend
npm install
NODE_PATH="${DIR}/frontend/node_modules" npm run build

# only keep what we need (for a small Heroku slug)
cd ..
mkdir temproot
mkdir temproot/backend
mkdir temproot/frontend

mv backend/build temproot/backend/
mv backend/node_modules temproot/node_modules/
mv frontend/build temproot/frontend/

find . ! -name "temproot" -type f -o -type d -exec rm -f -r {} +
mv temproot/* .
rmdir temproot
