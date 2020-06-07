import { logger } from './features/@common/logger'
import { orbitDbService } from './features/storage'
import { AccountRole } from './features/storage/types/AccountRole'

async function stop() {
  logger.info('Shutting down')
  await orbitDbService.stop()
  logger.info('Done')
}

async function start() {
  logger.info('Starting XPoints Backbone')
  await orbitDbService.start()

  let i = 0
  setTimeout(async () => {
    const account = await orbitDbService.createAccount({
      email: `oliver.hager${++i}@mail.com`,
      role: AccountRole.Admin,
    })
    console.log('Added account', JSON.stringify(account))
  }, 5000)

  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
  process.on('SIGQUIT', stop)
}

start()
