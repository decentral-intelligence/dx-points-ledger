import { provideAccountService, provideTransactionService } from '../../../../storage/utils'
import { NotAllowedError } from '../../../../../types/exceptions/NotAllowedError'
import { ForbiddenError } from 'apollo-server'

export const mutationResolver = {
  airdropPoints: async (parent: any, { args }: any): Promise<any> => {
    try {
      const sender = provideAccountService().getAccountById(args.sender)
      const recipient = provideAccountService().getAccountById(args.recipient)
      if (sender && recipient) {
        const transactionId = await provideTransactionService().airdrop({
          ...args,
          sender,
          recipient,
        })
        return transactionId
      }
      throw new Error('Unknown Sender and/or Recipient')
    } catch (e) {
      if (e instanceof NotAllowedError) {
        throw new ForbiddenError(e.message)
      }
      throw e
    }
  },
}
