# dx-points-ledger

Decentralized Ledger for persisting points/tokens

This is a simple service to provide access to the distributed
storage of xPoints.

The entities are stored in [OrbitDb](https://orbitdb.org), which is built
on top of [IPFS](https://ipfs.io). These technologies are part of
the so called [Web 3.0](https://medium.com/bitfishlabs/the-decentralized-internet-is-here-web-3-0-and-the-future-of-blockchain-powered-future-f16ff02584a9),
which is about a decentralization of the internet using peer-to-peer architectures

## Installation

> Requires NodeJS (>=14) installed

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

## Docker

The ledger comes with its own Dockerfile.

To build just run `npm run build:docker`

Once build you can start a container using `npm run docker`, which runs as attached production build

> To run as detached container use `npm run docker:d` (no console output)
