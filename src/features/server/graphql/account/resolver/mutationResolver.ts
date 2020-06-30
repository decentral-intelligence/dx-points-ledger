import { logger } from '../../../../@common/logger'
import { provideAccountService } from './provideAccountService'

export const mutationResolver = {
  createAccount: (parent: any, { args }: any): Promise<any> => {
    logger.debug(`Adding account ${JSON.stringify(args)}`)
    const { email, role } = args
    return provideAccountService().createAccount({ email, role })
  },
}
