import { CustomApolloContext } from '../../types/CustomApolloContext'

const transaction = (parent: any, { id }: any, { dataSources }: CustomApolloContext) =>
  dataSources.transactions.getTransaction(id)

export const queryResolver = {
  transaction,
}
