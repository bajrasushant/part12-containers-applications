#!/bin/bash

echo "Build script"

set -e

echo "Backend"
npm install
rm -rf dist/

echo "Building front end"
cd ../frontend
npm install
npm run build

echo "copying to backend"
cp -r dist ../backend/
