import { NotAllowedError } from '../../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'
import { CustomApolloContext } from '../../../types/CustomApolloContext'
import { tryGetAccounts } from './tryGetAccounts'

export const airdropPointsResolver = async (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): Promise<any> => {
  try {
    const { recipient, sender } = tryGetAccounts({
      accountService: dataSources.accounts,
      recipientId: args.recipient,
      senderId: args.sender,
    })
    return await dataSources.transactions.airdrop({
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
