import { logger } from './features/@common/logger'
import { orbitDbService } from './features/storage'
import { server } from './features/server'
import { onShutdown } from 'node-graceful-shutdown'
// @ts-ignore
import IpfsClient from 'ipfs-http-client'
import { config } from './config'

let intervalHandle: NodeJS.Timeout | null = null

onShutdown(async () => {
  logger.info('Shutting down')
  if (intervalHandle) {
    clearInterval(intervalHandle)
  }
  await Promise.all([server.stop(), orbitDbService.stop()])
  logger.info('Done')
})

async function start() {
  logger.info('Starting XPoints Backbone')
  await orbitDbService.start({
    ipfs: IpfsClient(),
    transactionsDatabaseAddress: config.get('db.transactions'),
    accountsDatabaseAddress: config.get('db.accounts'),
  })
  await server.start()
}

start()
