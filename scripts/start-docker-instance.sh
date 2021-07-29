#!/bin/bash

ENV_FILE=$(dirname "$0")/docker.env

docker run \
--env-file "$ENV_FILE" \
-p 3001:3001 -p 4001:4001 -p 4011:4011 -p 4012:4012  \
-v dxpvol:/app \
dx-points-backbone
