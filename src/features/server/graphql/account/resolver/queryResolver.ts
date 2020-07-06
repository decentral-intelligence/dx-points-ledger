import { CustomApolloContext } from '../../types/CustomApolloContext'

const accounts = (_: any, __: any, context: CustomApolloContext) => {
  return context.dataSources.accounts.getAllAccounts()
}

const getAccountByEmail = (_: any, { email }: any, { dataSources }: CustomApolloContext) =>
  dataSources.accounts.getAccount(email)

const getAccountById = (_: any, { id }: any, { dataSources }: CustomApolloContext) =>
  dataSources.accounts.getAccountById(id)

export const queryResolver = {
  accounts,
  getAccountByEmail,
  getAccountById,
}
