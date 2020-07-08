import pino from 'pino'

export const logger = pino({
  prettyPrint: { colorize: true },
  level: 'debug',
})
