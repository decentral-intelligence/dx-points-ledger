import { AccountRole } from '../types/AccountRole'
import { Entity } from './Entity'

export type AccountId = string

export interface Account extends Entity {
  email: string
  isActive: boolean
  balance: number
  role: AccountRole
}
