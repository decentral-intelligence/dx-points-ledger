import { logger } from './features/@common/logger'
import { orbitDbService } from './features/storage'
import { AccountRole } from './features/storage/types/AccountRole'
import { Account } from './features/storage/models/Account'

let intervalHandle: NodeJS.Timeout | null = null

async function stop() {
  logger.info('Shutting down')
  await orbitDbService.stop()
  if (intervalHandle) {
    clearInterval(intervalHandle)
  }
  logger.info('Done')
}

async function start() {
  logger.info('Starting XPoints Backbone')
  await orbitDbService.start()

  orbitDbService.accounts.events.on('replicated', () => {
    console.log('YAY!')
  })

  intervalHandle = setInterval(async () => {
    let accounts = await orbitDbService.accounts.get('')
    accounts.forEach((a: Account): void => console.log(a))
  }, 5000)

  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
  process.on('SIGQUIT', stop)
}

start()
