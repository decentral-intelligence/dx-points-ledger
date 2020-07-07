import { DataSource } from 'apollo-datasource'
import DocumentStore from 'orbit-db-docstore'
import { Account } from './models/Account'
import { logger } from '../@common/logger'
import { AccountRole } from './types/AccountRole'
import { createHash } from 'crypto'
import { encodeReedSolomon } from '../security/encodeReedSolomon'
import { OrbitDbService } from './OrbitDbService'

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

  public static getAccountIdFromPublicKey(publicKey: string): string {
    const hash = createHash('sha256')
    hash.update(publicKey)
    const digest = hash.digest('hex')
    return encodeReedSolomon('XPOINTZ', digest)
  }

  public async createAccount(accountArgs: CreateAccountArgs): Promise<Account> {
    const { publicKey } = accountArgs
    const id = AccountService.getAccountIdFromPublicKey(publicKey)

    const foundAccounts = await this.accounts.get(id)
    if (foundAccounts.length > 0) {
      throw new Error(`Account [${id}] already exists`)
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

  public getAccount(id: string): Account | null {
    const accounts = this.accounts.get(id)
    if (accounts.length > 0) {
      return Account.readFromJson(accounts[0])
    }
    return null
  }

  public getAllAccounts(): Account[] {
    return this.accounts.get('')
  }
}
