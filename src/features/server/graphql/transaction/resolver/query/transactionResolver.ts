import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const transactionResolver = (
  parent: any,
  { id }: any,
  { dataSources }: CustomApolloContext,
) => dataSources.transactions.getTransaction(id)
