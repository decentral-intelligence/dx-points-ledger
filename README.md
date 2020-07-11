# dx-points-backbone

Decentralized Backbone for DxPoints et al.

This is a simple service to provide access to the distributed
storage of DxPoints (Working Title)

## Prerequisites

- NodeJS (>=14) installed
- This service needs a running [IPFS Daemon](https://docs.ipfs.io/install/command-line-quick-start/#install-ipfs).

To start the daemon (with default settings) you need pubsub enabled, e.g. run

`ipfs daemon --enable-pubsub-experiment`

## Installation

Just do `npm install` - the rest is coffee time

## Run

`npm run start` to build and run the service

## Build

Calling `npm run build` to transpile into javascript into `./build`-folder

## Development mode

Calling `npm run dev` to run a nodemon watcher that transpiles
from typescript to javascript and re-executes the code on changes.

# Further Documentations

[About Signatures](./SIGNING.MD)
[More tools](./TOOLS.MD)
