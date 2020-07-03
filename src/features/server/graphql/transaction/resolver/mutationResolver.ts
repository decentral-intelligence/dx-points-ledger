import { provideAccountService, provideTransactionService } from '../../../../storage/utils'

export const mutationResolver = {
  airdropPoints: (parent: any, { args }: any): Promise<any> => {
    console.log('Airdrop', JSON.stringify(args))
    let sender = provideAccountService().getAccountById(args.sender)
    let recipient = provideAccountService().getAccountById(args.recipient)
    return provideTransactionService().airdrop({
      ...args,
      sender,
      recipient,
    })
  },
}
