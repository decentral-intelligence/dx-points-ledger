import { provideAccountService } from '../../../../storage/utils'
import { Transaction } from '../../../../storage/models/Transaction'
import { Account } from '../../../../storage/models/Account'

export const transactionSenderResolver = (parent: Transaction): Account | null => {
  return provideAccountService().getAccountById(parent.sender)
}

export const transactionRecipientResolver = (parent: Transaction): Account | null => {
  return provideAccountService().getAccountById(parent.recipient)
}
