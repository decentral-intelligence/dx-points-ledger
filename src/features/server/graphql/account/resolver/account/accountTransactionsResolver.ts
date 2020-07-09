import { Transaction } from '../../../../../storage/models/Transaction'
import { Account } from '../../../../../storage/models/Account'
import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const accountTransactionsResolver = (
  parent: Account,
  args: any,
  { dataSources }: CustomApolloContext,
): Transaction[] => {
  return dataSources.transactions.getTransactionsOfAccount(parent._id)
}
