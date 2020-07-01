import { provideTransactionService } from '../../transaction/provideTransactionService'
import { Transaction } from '../../../../storage/models/Transaction'
import { Account } from '../../../../storage/models/Account'

export const accountTransactionsResolver = (parent: Account): Transaction[] => {
  return provideTransactionService().getTransactionsOfAccount(parent._id)
}
