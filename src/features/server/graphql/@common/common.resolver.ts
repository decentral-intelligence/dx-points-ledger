import { mutationResolver } from './resolver/mutationResolver'
import { queryResolver } from './resolver/queryResolver'

const CommonResolver = {
  Query: queryResolver,
  Mutation: mutationResolver,
}

export default CommonResolver
