import { Transaction } from '../../../../storage/models/Transaction'
import { Account } from '../../../../storage/models/Account'
import { CustomApolloContext } from '../../types/CustomApolloContext'

export const transactionSenderResolver = (
  parent: Transaction,
  _: any,
  { dataSources }: CustomApolloContext,
): Account | null => dataSources.accounts.getAccount(parent.sender)

export const transactionRecipientResolver = (
  parent: Transaction,
  _: any,
  { dataSources }: CustomApolloContext,
): Account | null => dataSources.accounts.getAccount(parent.recipient)
