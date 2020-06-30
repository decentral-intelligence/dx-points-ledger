// @ts-ignore
import IpfsClient from 'ipfs-http-client'
import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import DocumentStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'

export class OrbitDbService {
  get transactions(): EventStore<any> {
    if (!this._transactions) {
      throw new Error('OrbitDB not started yet')
    }
    return this._transactions
  }

  get accounts(): DocumentStore<Account> {
    if (!this._accounts) {
      throw new Error('OrbitDB not started yet')
    }
    return this._accounts
  }

  private orbitdb: OrbitDB | undefined
  private _transactions: EventStore<any> | undefined
  private _accounts: DocumentStore<Account> | undefined

  constructor(private ipfs: any = IpfsClient()) {}

  private async initAccounts() {
    this._accounts = await this.orbitdb?.docstore('xpoints:accounts', {
      accessController: {
        write: ['*'],
      },
    })
    await this._accounts?.load()
    logger.info(`Collection 'accounts' initialized - Address: ${this._accounts?.address}`)
  }

  private async initTransactions() {
    this._transactions = await this.orbitdb?.log('xpoints:transactions')
    await this._transactions?.load(1)
    logger.info(`Collection 'transactions' initialized - Address: ${this._transactions?.address}`)
  }

  public async start() {
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(this.ipfs)
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb?.id)}`)
    await this.initAccounts()
    await this.initTransactions()
  }

  public async stop() {
    logger.info('Stopping OrbitDB...')
    await this.orbitdb?.stop()
  }
}
