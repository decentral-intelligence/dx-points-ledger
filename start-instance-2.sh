#!/bin/bash
export API_PORT=3002
export IPFS_REPO='./ipfs-2'
export IPFS_ADDRESSES='/ip4/0.0.0.0/tcp/5011','/ip4/0.0.0.0/tcp/5012/ws'
export DB_TRANSACTIONS=$1
export DB_ACCOUNTS=$2

node ./build/main.js
