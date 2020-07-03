import { queryResolver } from './resolver/queryResolver'
import { mutationResolver } from './resolver/mutationResolver'
import { accountTransactionsResolver } from './resolver/accountTransactionsResolver'

const AccountResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Account: {
    transactions: accountTransactionsResolver,
  },
}

export default AccountResolver
