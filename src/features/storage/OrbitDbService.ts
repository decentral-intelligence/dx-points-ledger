// @ts-ignore
import IpfsClient from 'ipfs-http-client'
// @ts-ignore
import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import * as crypto from 'crypto'
import { AccountRole } from './types/AccountRole'

interface CreateAccountArgs {
  email: string
  role: AccountRole
}

export class OrbitDbService {
  private orbitdb: any = null
  private transactions: any = null
  private accounts: any = null

  constructor(private ipfs: any = IpfsClient()) {}

  private async initAccounts() {
    this.accounts = await this.orbitdb.docstore('xpoints:accounts')
    await this.accounts.load(1)
    logger.info(`Collection 'accounts' initialized - Address: ${this.accounts.address}`)
  }

  private async initTransactions() {
    this.transactions = await this.orbitdb.log('xpoints:transactions')
    await this.transactions.load(1)
    logger.info(`Collection 'transactions' initialized - Address: ${this.transactions.address}`)
  }

  async start() {
    logger.info('Connecting to IPFS daemon')
    this.ipfs = IpfsClient()
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(this.ipfs)
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb.identity.id)}`)
    await this.initAccounts()
    await this.initTransactions()
  }

  private static createEntityIdForUniques(uniqueValue: string): string {
    return crypto.createHash('sha256').update(uniqueValue, 'utf8').digest('base64')
  }

  async createAccount(accountArgs: CreateAccountArgs): Promise<Account> {
    const { email } = accountArgs
    const id = OrbitDbService.createEntityIdForUniques(email)
    const foundAccounts = await this.accounts.get(id)
    // if (foundAccounts.length > 0) {
    //     throw new Error(`Account [${email}] already exists`)
    // }
    const newAccount = {
      ...accountArgs,
      _id: id,
      isActive: true,
      balance: 0,
    }

    await this.accounts.put(newAccount)
    return newAccount
  }

  async stop() {
    logger.info('Stopping OrbitDB')
    if (this.orbitdb) {
      await this.orbitdb.stop()
    }
  }
}
