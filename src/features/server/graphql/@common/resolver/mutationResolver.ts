import { provideAccountService, provideTransactionService } from '../../../../storage/utils'

export const mutationResolver = {
  dropAll: async (parent: any, { args }: any): Promise<any> => {
    console.log('Dropping all!', JSON.stringify(args))
    await provideTransactionService().drop()
    await provideAccountService().drop()
  },
}
