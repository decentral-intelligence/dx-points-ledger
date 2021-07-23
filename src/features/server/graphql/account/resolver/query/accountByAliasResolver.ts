import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const accountByAliasResolver = (
  _: any,
  { alias }: any,
  { dataSources }: CustomApolloContext,
) => dataSources.accounts.getAccountByAlias(alias)
