import { mutationResolver } from '../transaction/resolver/mutationResolver'
import { queryResolver } from '../transaction/resolver/queryResolver'

const CommonResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
}

export default CommonResolver
