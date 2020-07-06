import { CustomApolloContext } from '../../types/CustomApolloContext'

const accounts = (_: any, __: any, context: CustomApolloContext) => {
  return context.dataSources.accounts.getAllAccounts()
}

const account = (_: any, { id }: any, { dataSources }: CustomApolloContext) =>
  dataSources.accounts.getAccount(id)

export const queryResolver = {
  accounts,
  account,
}
