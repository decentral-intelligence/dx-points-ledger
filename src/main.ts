import { logger } from './features/@common/logger'
import { IpfsService, orbitDbService } from './features/storage'
import { server } from './features/server'
import { onShutdown } from 'node-graceful-shutdown'
import { config } from './config'

async function shutdown() {
  logger.info('Shutting down')
  await Promise.all([server.stop(), orbitDbService.stop()])
  logger.info('Done')
}

async function start() {
  logger.info('Starting XPoints Backbone')
  const ipfsService = new IpfsService()
  await ipfsService.start(config.get('ipfs'))

  await orbitDbService.start({
    ipfsService,
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
