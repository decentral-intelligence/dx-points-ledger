// @ts-ignore
import IpfsClient from 'ipfs-http-client'
import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import { AccountRole } from './types/AccountRole'
import DocumentStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { createHash } from 'crypto'

interface CreateAccountArgs {
  email: string
  role: AccountRole
}

const createEntityIdForUniques = (uniqueValue: string): string =>
  createHash('sha256').update(uniqueValue, 'utf8').digest('base64')

export class OrbitDbService {
  get accounts(): any {
    return this._accounts
  }

  private orbitdb: OrbitDB | undefined
  private transactions: EventStore<any> | undefined
  private _accounts: DocumentStore<Account> | undefined

  constructor(private ipfs: any = IpfsClient()) {}

  private async initAccounts() {
    this._accounts = await this.orbitdb?.docstore('xpoints:accounts', {
      accessController: {
        write: ['*'],
      },
    })
    await this._accounts?.load(1)
    logger.info(`Collection 'accounts' initialized - Address: ${this._accounts?.address}`)
  }

  private async initTransactions() {
    this.transactions = await this.orbitdb?.log('xpoints:transactions')
    await this.transactions?.load(1)
    logger.info(`Collection 'transactions' initialized - Address: ${this.transactions?.address}`)
  }

  public async start() {
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(this.ipfs)
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb?.id)}`)
    await this.initAccounts()
    await this.initTransactions()
  }

  public async createAccount(accountArgs: CreateAccountArgs): Promise<Account> {
    if (!this._accounts) {
      throw new Error('OrbitDB not started yet')
    }
    const { email } = accountArgs
    const id = createEntityIdForUniques(email)
    const foundAccounts = await this._accounts.get(id)
    // if (foundAccounts.length > 0) {
    //     throw new Error(`Account [${email}] already exists`)
    // }
    const newAccount = {
      ...accountArgs,
      _id: id,
      isActive: true,
      balance: 0,
    }

    await this._accounts.put(newAccount, { pin: true })
    return newAccount
  }

  async stop() {
    logger.info('Stopping OrbitDB')
    if (this.orbitdb) {
      await this.orbitdb.stop()
    }
  }
}
