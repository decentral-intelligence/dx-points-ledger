import { mutationResolver } from './resolver/mutationResolver'
import { queryResolver } from './resolver/queryResolver'

const TransactionResolver = {
  // Query: queryResolver,
  Mutation: mutationResolver,
}

export default TransactionResolver
