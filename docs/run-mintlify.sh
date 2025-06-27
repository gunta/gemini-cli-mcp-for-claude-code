#!/bin/bash

# Workaround for Node.js v24 compatibility issue with Mintlify
# This script attempts to run Mintlify with compatibility flags

echo "Starting Mintlify with Node.js v24 workaround..."

# Try to run with no-deprecation flag which sometimes helps with compatibility
NODE_NO_WARNINGS=1 NODE_OPTIONS="--no-deprecation" npx mintlify@latest dev

# If the above fails, you can use the Docker method:
# echo "If you see errors, try running: bun run docs:dev:docker" 