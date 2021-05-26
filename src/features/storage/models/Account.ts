import { AccountRole } from '../types/AccountRole'
import { Entity } from './Entity'

export type AccountId = string

export interface AccountData {
  _id: string
  alias?: string
  publicKey: string
  isActive: boolean
  balance: number
  role: AccountRole
}

export class Account implements Entity {
  public _id = ''
  public publicKey = ''
  public alias = ''
  public isActive = false
  public balance = 0
  public role = AccountRole.Common

  public isOfRole(role: AccountRole) {
    return this.role.toLowerCase() === role.toLowerCase()
  }

  static readFromJson(data: AccountData): Account {
    const account = new Account()
    Object.keys(data).forEach((k) => {
      // @ts-ignore
      account[k] = data[k]
    })
    return account
  }
}
