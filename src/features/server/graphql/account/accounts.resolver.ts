import { queryResolver } from './resolver/queryResolver'
import { mutationResolver } from './resolver/mutationResolver'
import { accountTransactionsResolver } from './resolver/accountTransactionsResolver'

const AccountsResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Account: {
    transactions: accountTransactionsResolver,
  },
}

export default AccountsResolver
