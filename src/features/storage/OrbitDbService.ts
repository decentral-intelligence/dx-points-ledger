import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import DocumentStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { OrbitDbServiceOptions } from './types/OrbitDbServiceOptions'
import { TransactionData } from './models/TransactionData'
import { IpfsService } from './IpfsService'
import { MemoryPool } from './utils'
import { config } from '../../config'

export class OrbitDbService {
  get transactionsPool(): MemoryPool<TransactionData> {
    return this._transactionsPool
  }

  get transactions(): EventStore<TransactionData> {
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

  private ipfsService: IpfsService | undefined
  private orbitdb: OrbitDB | undefined
  private _transactions: EventStore<TransactionData> | undefined
  private _transactionsPool = new MemoryPool<TransactionData>()
  private _accounts: DocumentStore<Account> | undefined

  private async initAccounts(address: string): Promise<void> {
    logger.info(`Loading accounts database... - Address: ${address}`)
    this._accounts = await this.orbitdb?.docstore(address, {
      accessController: {
        write: ['*'],
      },
    })
    await this._accounts?.load()
    logger.info(`Database initialized - Address: ${this._accounts?.address}`)
  }

  private async initTransactions(address: string): Promise<void> {
    logger.info(`Loading transactions database... - Address: ${address}`)
    this._transactions = await this.orbitdb?.log(address, {
      accessController: {
        write: ['*'],
      },
    })
    await this._transactions?.load()

    logger.info(`Database initialized - Address: ${this._transactions?.address}`)
  }

  private initializeEventHandlers() {
    if (config.get('env') !== 'development') {
      return
    }
    this._transactions?.events.on('peer', (peer) => {
      logger.info(`Transactions: New peer connected: ${peer}`)
    })
    this._transactions?.events.on('replicated', () => {
      logger.info('Transactions replicated')
    })

    this._accounts?.events.on('peer', (peer) => {
      logger.info(`Accounts: New peer connected: ${peer}`)
    })
    this.accounts?.events.on('replicated', () => {
      logger.info('Accounts replicated')
    })

    logger.info('Initialized Event Handlers')
  }

  public async start(options: OrbitDbServiceOptions): Promise<void> {
    const { accountsDatabaseAddress, ipfsService, transactionsDatabaseAddress } = options
    logger.info('Starting OrbitDb...')
    this.ipfsService = ipfsService
    this.orbitdb = await OrbitDB.createInstance(ipfsService.ipfsNode)
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb?.id)}`)
    await Promise.all([
      this.initAccounts(accountsDatabaseAddress),
      this.initTransactions(transactionsDatabaseAddress),
    ])
    this.initializeEventHandlers()
  }

  public async stop(): Promise<void> {
    logger.info('Stopping OrbitDB...')
    await this._transactionsPool.finish()
    await this.orbitdb?.stop()
    await this.ipfsService?.stop()
  }
}
