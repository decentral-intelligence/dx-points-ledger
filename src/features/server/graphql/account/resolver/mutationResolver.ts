import { logger } from '../../../../@common/logger'
import { CustomApolloContext } from '../../types/CustomApolloContext'

const createAccount = (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): Promise<any> => {
  logger.debug(`Adding account ${JSON.stringify(args)}`)
  const { email, role } = args
  return dataSources.accounts.createAccount({ email, role })
}

export const mutationResolver = {
  createAccount,
}
