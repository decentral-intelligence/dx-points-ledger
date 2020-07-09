import { Account } from '../../../../../storage/models/Account'
import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const accountBalanceResolver = (
  parent: Account,
  args: any,
  { dataSources }: CustomApolloContext,
): number => dataSources.transactions.calculateBalanceOfAccount(parent._id)
