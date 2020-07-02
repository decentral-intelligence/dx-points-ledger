import { provideTransactionService } from '../../../../storage/utils'

export const queryResolver = {
  transaction: (parent: any, { id }: any) => provideTransactionService().getTransaction(id),
}
