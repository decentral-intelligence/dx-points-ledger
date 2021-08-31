import { logger } from '../../../../../@common/logger'
import { CustomApolloContext } from '../../../types/CustomApolloContext'
import { Account } from '../../../../../storage/models/Account'
import { verifyPermission } from '../../../@common/verifyPermission'
import { NotAllowedError } from '../../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'

export const createAccountResolver = (
  parent: unknown,
  { args }: any,
  context: CustomApolloContext,
): Promise<Account> => {
  try {
    const { dataSources, key } = context
    const { alias, publicKey, role } = args
    verifyPermission(role, key)
    logger.debug(`Adding account ${JSON.stringify(args)}`)
    return dataSources.accounts.createAccount({ publicKey, role, alias })
  } catch (e) {
    logger.error(e.message)
    if (e instanceof NotAllowedError) {
      throw new ForbiddenError(e.message)
    }
    throw e
  }
}
