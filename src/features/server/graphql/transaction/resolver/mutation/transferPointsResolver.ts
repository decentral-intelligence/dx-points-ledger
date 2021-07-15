import { NotAllowedError } from '../../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'
import { CustomApolloContext } from '../../../types/CustomApolloContext'
import { tryGetAccounts } from './tryGetAccounts'
import { TransactionData } from '../../../../../storage/models/TransactionData'

export const transferPointsResolver = (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): Promise<TransactionData> => {
  try {
    const { recipient, sender } = tryGetAccounts({
      accountService: dataSources.accounts,
      recipientId: args.recipient,
      senderId: args.sender,
    })

    return dataSources.transactions.transfer({
      ...args,
      sender,
      recipient,
    })
  } catch (e) {
    if (e instanceof NotAllowedError) {
      throw new ForbiddenError(e.message)
    }
    throw e
  }
}
