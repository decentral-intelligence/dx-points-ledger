import { NotAllowedError } from '../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'
import { CustomApolloContext } from '../../types/CustomApolloContext'

const airdropPoints = async (
  parent: any,
  { args }: any,
  { dataSources }: CustomApolloContext,
): Promise<any> => {
  try {
    const { accounts, transactions } = dataSources
    const sender = accounts.getAccountById(args.sender)
    const recipient = accounts.getAccountById(args.recipient)
    if (sender && recipient) {
      return await transactions.airdrop({
        ...args,
        sender,
        recipient,
      })
    }
    throw new Error('Unknown Sender and/or Recipient')
  } catch (e) {
    if (e instanceof NotAllowedError) {
      throw new ForbiddenError(e.message)
    }
    throw e
  }
}

export const mutationResolver = {
  airdropPoints,
}
