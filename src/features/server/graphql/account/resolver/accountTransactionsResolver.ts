import { provideTransactionService } from '../../../../storage/utils/provideTransactionService'
import { Transaction } from '../../../../storage/models/Transaction'
import { Account } from '../../../../storage/models/Account'

interface Context {}

export const accountTransactionsResolver = (
  parent: Account,
  args: any,
  context: any,
): Transaction[] => {
  console.log('accountTransactionsResolver', context)
  return provideTransactionService().getTransactionsOfAccount(parent._id)
}
