#!/bin/bash

ENV_FILE=$(dirname "$0")/docker.env

docker run \
--env-file "$ENV_FILE" \
-p 3001:3001 -p 4001:4001 -p 40011:4011 -p 40012:4012  \
dx-points-backbone
