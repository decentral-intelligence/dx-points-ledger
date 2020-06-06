import { logger } from './features/@common/logger'
import { orbitDbService } from './features/storage'

async function stop() {
  logger.info('Shutting down')
  await orbitDbService.stop()
  logger.info('Done')
}

async function start() {
  logger.info('Starting XPoints Backbone')
  await orbitDbService.start()
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
  process.on('SIGQUIT', stop)
}

start()
