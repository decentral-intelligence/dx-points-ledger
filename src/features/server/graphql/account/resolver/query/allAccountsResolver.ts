import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const allAccountsResolver = (_: any, __: any, context: CustomApolloContext) =>
  context.dataSources.accounts.getAllAccounts()
