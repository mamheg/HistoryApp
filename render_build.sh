#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "Installing Node.js dependencies..."
npm install

echo "Building Frontend..."
npm run build

echo "Build successful!"
