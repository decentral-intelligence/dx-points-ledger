#!/bin/bash
npm run build
docker build . -t dx-points-backbone --pull --no-cache
