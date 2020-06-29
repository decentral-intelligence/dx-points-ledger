import { logger } from './features/@common/logger'
import { OrbitDbService } from './features/storage'
import { Server } from './features/server'
import { onShutdown } from 'node-graceful-shutdown'

let intervalHandle: NodeJS.Timeout | null = null
let orbitDbService = new OrbitDbService()
let server = new Server()

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
  await orbitDbService.start()
  await server.start()

  // intervalHandle = setInterval(async () => {
  //     let accounts = await orbitDbService.accounts.get('')
  //     accounts.forEach((a: Account): void => console.log(a))
  // }, 5000)
}

start()
