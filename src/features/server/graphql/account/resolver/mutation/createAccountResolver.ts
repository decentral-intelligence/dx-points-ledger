import { logger } from '../../../../../@common/logger'
import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const createAccountResolver = (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): Promise<any> => {
  logger.debug(`Adding account ${JSON.stringify(args)}`)
  const { alias, publicKey, role } = args
  return dataSources.accounts.createAccount({ publicKey, role, alias })
}
