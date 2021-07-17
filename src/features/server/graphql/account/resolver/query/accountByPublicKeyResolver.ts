import { CustomApolloContext } from '../../../types/CustomApolloContext'

export const accountByPublicKeyResolver = (
  _: any,
  { publicKey }: any,
  { dataSources }: CustomApolloContext,
) => dataSources.accounts.getAccountByPublicKey(publicKey)
