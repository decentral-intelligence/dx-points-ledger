import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import DocumentStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { OrbitDbServiceOptions } from './types/OrbitDbServiceOptions'

const DatabaseNames = {
  Accounts: 'xpoints:accounts',
  Transactions: 'xpoints:transactions',
}

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

  private async initAccounts(address = DatabaseNames.Accounts): Promise<void> {
    logger.info(`Loading database '${DatabaseNames.Accounts}' collection...`)
    this._accounts = await this.orbitdb?.docstore(address, {
      accessController: {
        write: ['*'],
      },
    })
    await this._accounts?.load()
    logger.info(
      `Database '${DatabaseNames.Accounts}' initialized - Address: ${this._accounts?.address}`,
    )
  }

  private async initTransactions(address = DatabaseNames.Transactions): Promise<void> {
    logger.info(`Loading database '${DatabaseNames.Transactions}' collection...`)
    this._transactions = await this.orbitdb?.log(address)
    await this._transactions?.load()
    logger.info(
      `Database '${DatabaseNames.Transactions}' initialized - Address: ${this._transactions?.address}`,
    )
  }

  public async start(options: OrbitDbServiceOptions): Promise<void> {
    const { accountsDatabaseAddress, ipfs, transactionsDatabaseAddress } = options
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(ipfs)
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb?.id)}`)
    await Promise.all([
      this.initAccounts(accountsDatabaseAddress),
      this.initTransactions(transactionsDatabaseAddress),
    ])
  }

  public async stop(): Promise<void> {
    logger.info('Stopping OrbitDB...')
    await this.orbitdb?.stop()
  }
}
