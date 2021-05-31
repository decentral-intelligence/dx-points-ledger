import { logger } from './features/@common/logger'
import { IpfsService, orbitDbService } from './features/storage'
import { graphQlServer } from './features/server'
import { onShutdown } from 'node-graceful-shutdown'
import { config } from './config'

async function shutdown() {
  logger.info('Shutting down')
  await graphQlServer.stop()
  await orbitDbService.stop()
  logger.info('Done')
}

const eventuallyPrintSecurityWarning = () => {
  if (!config.get('verifySignatures')) {
    logger.warn(`
==========================================================

            SIGNATURE VERIFICATION NOT ACTIVE
    
==========================================================    
    `)
  }
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
  await graphQlServer.start()

  eventuallyPrintSecurityWarning()
}

;(async () => {
  try {
    onShutdown(shutdown)
    await start()
    logger.info('System up and running fine')
  } catch (e) {
    logger.error(e)
    logger.error('Snap - Loading failed')
    await shutdown()
  }
})()
