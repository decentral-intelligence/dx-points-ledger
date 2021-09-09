import { NotAllowedError } from '../../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'
import { CustomApolloContext } from '../../../types/CustomApolloContext'
import { tryGetAccounts } from './tryGetAccounts'
import { TransactionData } from '../../../../../storage/models/TransactionData'
import { verifyPermission } from '../../../@common/verifyPermission'
import { logger } from '../../../../../@common/logger'

export const airdropPointsResolver = (
  parent: any,
  { args }: any,
  { dataSources, key }: CustomApolloContext,
): Promise<TransactionData> => {
  try {
    const { recipient, sender } = tryGetAccounts({
      accountService: dataSources.accounts,
      recipientId: args.recipient,
      senderId: args.sender,
    })

    verifyPermission(sender.role, key)

    return dataSources.transactions.airdrop({
      ...args,
      sender,
      recipient,
    })
  } catch (e: any) {
    logger.error(e.message)
    if (e instanceof NotAllowedError) {
      throw new ForbiddenError(e.message)
    }
    throw e
  }
}
