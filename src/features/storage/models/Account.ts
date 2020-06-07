import { AccountRole } from '../types/AccountRole'
import { Entity } from './Entity'

export interface Account extends Entity {
  email: string
  isActive: boolean
  balance: number
  role: AccountRole
}
