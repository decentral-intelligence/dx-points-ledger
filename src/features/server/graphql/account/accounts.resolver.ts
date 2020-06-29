import { queryResolver } from './resolver/queryResolver'
import { mutationResolver } from './resolver/mutationResolver'

const AccountsResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
}

export default AccountsResolver
