import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'
import { Account } from './models/Account'
import DocumentStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { OrbitDbServiceOptions } from './types/OrbitDbServiceOptions'
import { OperationsQueue } from './utils'
import { TransactionData } from './models/TransactionData'
import { IpfsService } from './IpfsService'

export class OrbitDbService {
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

  get operationsQueue(): OperationsQueue {
    return this._operationsQueue
  }

  private ipfsService: IpfsService | undefined
  private orbitdb: OrbitDB | undefined
  private _transactions: EventStore<TransactionData> | undefined
  private _accounts: DocumentStore<Account> | undefined
  private _operationsQueue = new OperationsQueue()

  private async initAccounts(address: string): Promise<void> {
    logger.info(`Loading database...`)
    this._accounts = await this.orbitdb?.docstore(address, {
      accessController: {
        write: ['*'],
      },
    })
    await this._accounts?.load()
    logger.info(`Database initialized - Address: ${this._accounts?.address}`)
  }

  private async initTransactions(address: string): Promise<void> {
    logger.info(`Loading database...`)
    this._transactions = await this.orbitdb?.log(address)
    await this._transactions?.load()
    logger.info(`Database initialized - Address: ${this._transactions?.address}`)
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
  }

  public async stop(): Promise<void> {
    await this._operationsQueue.finish()
    logger.info('Closing databases...')
    await Promise.all([this.transactions.close(), this.accounts.close()])
    await this.ipfsService?.stop()
    logger.info('Stopping OrbitDB...this may take a while - be patient')
    await this.orbitdb?.stop()
  }
}
