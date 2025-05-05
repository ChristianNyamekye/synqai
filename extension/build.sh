#!/bin/bash

# Compile TypeScript
tsc

# Copy compiled files to root
cp src/*.js .
cp src/*.js.map .

# Create necessary directories
mkdir -p icons

echo "Build complete!" 