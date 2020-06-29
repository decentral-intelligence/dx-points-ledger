import { logger } from './features/@common/logger'
import { OrbitDbService } from './features/storage'
import { Account } from './features/storage/models/Account'
import { onShutdown } from 'node-graceful-shutdown'

let intervalHandle: NodeJS.Timeout | null = null
let orbitDbService = new OrbitDbService()

onShutdown(async () => {
  logger.info('Shutting down')
  if (intervalHandle) {
    clearInterval(intervalHandle)
  }
  await orbitDbService.stop()
  logger.info('Done')
})

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
}

start()
