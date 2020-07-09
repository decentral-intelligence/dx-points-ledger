import { AccountId } from './Account'

export interface TransactionData {
  amount: number
  hash: string
  isAirdrop?: boolean
  message?: string
  recipient: AccountId
  sender: AccountId
  signature: string
  timestamp: number
  tags: string[]
}
