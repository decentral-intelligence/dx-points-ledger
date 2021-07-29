#!/bin/bash

# Call like this
#
#

SCRIPT_DIR=$(dirname "$0")

export API_PORT=3002
export IPFS_REPO='./ipfs-2'
export IPFS_ADDRESSES='/ip4/0.0.0.0/tcp/5011','/ip4/0.0.0.0/tcp/5012/ws'
export DB_ACCOUNTS=$1
export DB_TRANSACTIONS=$2

node "$SCRIPT_DIR"/../build/main.js
