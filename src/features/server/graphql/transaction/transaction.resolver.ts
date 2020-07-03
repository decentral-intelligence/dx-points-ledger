import {
  transactionRecipientResolver,
  transactionSenderResolver,
} from './resolver/transactionAccountResolver'
import { mutationResolver } from './resolver/mutationResolver'
import { queryResolver } from './resolver/queryResolver'

const TransactionResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Transaction: {
    sender: transactionSenderResolver,
    recipient: transactionRecipientResolver,
  },
}

export default TransactionResolver
