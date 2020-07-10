import { NotAllowedError } from '../../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'
import { CustomApolloContext } from '../../../types/CustomApolloContext'
import { tryGetAccounts } from './tryGetAccounts'
import { TransactionData } from '../../../../../storage/models/TransactionData'

export const airdropPointsResolver = (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): TransactionData => {
  try {
    const { recipient, sender } = tryGetAccounts({
      accountService: dataSources.accounts,
      recipientId: args.recipient,
      senderId: args.sender,
    })
    return dataSources.transactions.airdrop({
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
