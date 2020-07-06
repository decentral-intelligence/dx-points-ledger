import { AccountId } from './Account'

export interface TransactionData {
  sender: AccountId
  recipient: AccountId
  amount: number
  timestamp: number
  signature: string
  message?: string
  hash: string
}
