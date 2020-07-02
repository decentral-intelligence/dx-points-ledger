import { AccountId } from './Account'
import { Entity } from './Entity'

export type TransactionId = string

export interface Transaction extends Entity {
  sender: AccountId
  recipient: AccountId
  amount: number
  timestamp: number
  signature: string
  message: string
}
