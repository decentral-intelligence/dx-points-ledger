import { logger } from '../../../../@common/logger'

export const mutationResolver = {
  createAccount: (parent: any, args: any): any => {
    logger.info('Adding account', args)
    return null
  },
}
