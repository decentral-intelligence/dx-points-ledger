import {
  transactionRecipientResolver,
  transactionSenderResolver,
} from './resolver/transaction/transactionAccountResolver'
import { airdropPointsResolver } from './resolver/mutation/airdropPointsResolver'
import { transactionResolver } from './resolver/query/transactionResolver'
import { transferPointsResolver } from './resolver/mutation/transferPointsResolver'

const TransactionResolver = {
  Query: {
    transaction: transactionResolver,
  },
  Mutation: {
    airdropPoints: airdropPointsResolver,
    transferPoints: transferPointsResolver,
  },
  Transaction: {
    sender: transactionSenderResolver,
    recipient: transactionRecipientResolver,
  },
  UnconfirmedTransaction: {
    sender: transactionSenderResolver,
    recipient: transactionRecipientResolver,
  },
}

export default TransactionResolver
