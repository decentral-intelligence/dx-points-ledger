import { DataSource } from 'apollo-datasource'
import DocumentStore from 'orbit-db-docstore'
import { Account } from './models/Account'
import { logger } from '../@common/logger'
import { createEntityIdForUniques } from './utils/createEntityIdForUniques'
import { AccountRole } from './types/AccountRole'

interface CreateAccountArgs {
  email: string
  role: AccountRole
}

export class AccountService extends DataSource {
  constructor(private accounts: DocumentStore<Account>) {
    super()
  }

  public async drop(): Promise<void> {
    return this.accounts.drop()
  }

  public async createAccount(accountArgs: CreateAccountArgs): Promise<Account> {
    const { email } = accountArgs
    const id = createEntityIdForUniques(email)

    const foundAccounts = await this.accounts.get(id)
    if (foundAccounts.length > 0) {
      throw new Error(`Account [${email}] already exists`)
    }

    const newAccount = Account.readFromJson({
      ...accountArgs,
      _id: id,
      isActive: true,
      balance: 0,
    })

    // @ts-ignore
    await this.accounts.put(newAccount)
    logger.debug(`Added account ${id}`)
    return newAccount
  }

  public getAccountById(id: string): Account | null {
    const accounts = this.accounts.get(id)
    if (accounts.length > 0) {
      return Account.readFromJson(accounts[0])
    }
    return null
  }

  public getAccount(email: string): Account | null {
    const id = createEntityIdForUniques(email)
    return this.getAccountById(id)
  }

  public getAllAccounts(): Account[] {
    return this.accounts.get('')
  }
}
