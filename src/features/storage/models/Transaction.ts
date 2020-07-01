import { Entity } from './Entity'

export interface Transaction extends Entity {
  sender: string
  recipient: string
  amount: number
  timestamp: number
  hash: string
  signature: string
}
