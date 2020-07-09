import { AccountService } from '../../../../../storage'
import { Account } from '../../../../../storage/models/Account'

interface Args {
  accountService: AccountService
  senderId: string
  recipientId: string
}

export const tryGetAccounts = (args: Args): { sender: Account; recipient: Account } => {
  const { recipientId, accountService, senderId } = args
  const sender = accountService.getAccount(senderId)
  const recipient = accountService.getAccount(recipientId)
  if (!(sender && recipient)) {
    throw new Error('Unknown Sender and/or Recipient')
  }

  if (!sender.isActive) {
    throw new Error(`Sender ${sender._id} is not active`)
  }

  if (!recipient.isActive) {
    throw new Error(`Recipient ${recipient._id} is not active`)
  }

  return {
    sender,
    recipient,
  }
}
