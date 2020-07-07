import { logger } from './features/@common/logger'
import { IpfsService, orbitDbService } from './features/storage'
import { server } from './features/server'
import { onShutdown } from 'node-graceful-shutdown'
// @ts-ignore
// import IpfsClient from 'ipfs-http-client'
import { config } from './config'

let intervalHandle: NodeJS.Timeout | null = null

async function shutdown() {
  logger.info('Shutting down')
  if (intervalHandle) {
    clearInterval(intervalHandle)
  }
  await Promise.all([server.stop(), orbitDbService.stop()])
  logger.info('Done')
}

async function start() {
  logger.info('Starting XPoints Backbone')
  let ipfsService = new IpfsService()
  await ipfsService.start(config.get('ipfs'))

  await orbitDbService.start({
    ipfs: ipfsService.ipfsNode,
    transactionsDatabaseAddress: config.get('db.transactions'),
    accountsDatabaseAddress: config.get('db.accounts'),
  })
  await server.start()
}

onShutdown(shutdown)

start()
  .then(() => {
    logger.info('System up and running fine')
  })
  .catch(async (e) => {
    logger.error(e)
    logger.error('Snap - Loading failed')
    await shutdown()
  })
