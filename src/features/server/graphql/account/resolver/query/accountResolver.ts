import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const accountResolver = (_: any, { id }: any, { dataSources }: CustomApolloContext) =>
  dataSources.accounts.getAccount(id)
