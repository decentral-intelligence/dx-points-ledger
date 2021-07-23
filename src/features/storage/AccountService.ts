import { DataSource } from 'apollo-datasource'
import DocumentStore from 'orbit-db-docstore'
import { Account } from './models/Account'
import { logger } from '../@common/logger'
import { AccountRole } from './types/AccountRole'
import { OrbitDbService } from './OrbitDbService'
import { getAccountIdFromPublicKey } from './utils'

interface CreateAccountArgs {
  publicKey: string
  alias?: string
  role: AccountRole
}

export class AccountService extends DataSource {
  private accounts: DocumentStore<Account>

  constructor(orbitDbService: OrbitDbService) {
    super()
    this.accounts = orbitDbService.accounts
  }

  public async drop(): Promise<void> {
    return this.accounts.drop()
  }

  public async createAccount(accountArgs: CreateAccountArgs): Promise<Account> {
    const { publicKey, alias } = accountArgs
    const id = getAccountIdFromPublicKey(publicKey)

    if (this.getAccount(id)) {
      throw new Error(`Account [${id}] already exists`)
    }

    if (alias && this.getAccountByAlias(alias)) {
      throw new Error(`Alias [${alias}] already taken`)
    }

    const newAccount = Account.readFromJson({
      ...accountArgs,
      _id: id,
      isActive: true,
      balance: 0,
    })

    await this.accounts.put(newAccount)
    logger.debug(`Added account ${id}`)
    return newAccount
  }

  public getAccount(id: string): Account | null {
    const accounts = this.accounts.get(id)
    if (accounts.length > 0) {
      return Account.readFromJson(accounts[0])
    }
    return null
  }

  public getAccountByPublicKey(publicKey: string): Account | null {
    const id = getAccountIdFromPublicKey(publicKey)
    return this.getAccount(id)
  }

  public getAllAccounts(): Account[] {
    return this.accounts.get('')
  }

  public getAccountByAlias(alias: string): Account | null {
    const accounts = this.accounts.query((a) => a.alias === alias)
    if (!accounts.length) return null

    return Account.readFromJson(accounts[0])
  }
}
