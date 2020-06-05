import {logger} from './features/logger'
import {orbitDbService} from './features/orbitdb'

async function stop() {
    logger.info('Shutting down');
    await orbitDbService.stop()
    logger.info('Done');
}

async function start() {
    logger.info('Starting XPoints Backbone')
    await orbitDbService.start()
    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
    process.on('SIGQUIT', stop);
}

start()
