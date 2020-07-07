import EventStore from 'orbit-db-eventstore'
import { Transaction, TransactionId } from './models/Transaction'
import { DataSource } from 'apollo-datasource'
import { Account, AccountId } from './models/Account'
import { AccountRole } from './types/AccountRole'
import { NotAllowedError } from '../../types/exceptions/NotAllowedError'
import { Seconds } from './utils/constants'
import { generateHash } from '../security/generateHash'
import { logger } from '../@common/logger'
import { TransactionData } from './models/TransactionData'
import { OrbitDbService } from './OrbitDbService'

export interface TransactionArgs {
  sender: Account
  recipient: Account
  amount: number
  message?: string
  signature: string
}

export class TransactionService extends DataSource {
  private transactions: EventStore<TransactionData>

  constructor(private orbitDbService: OrbitDbService) {
    super()
    this.transactions = orbitDbService.transactions
  }

  public async drop(): Promise<void> {
    return this.transactions.drop()
  }

  public getTransactionsOfAccount(userId: AccountId): Transaction[] {
    return this.transactions
      .iterator({ limit: -1 })
      .collect()
      .filter(({ payload: { value } }) => value.sender === userId || value.recipient === userId)
      .map(({ payload: { value }, hash }) => ({
        ...value,
        _id: hash,
      }))
  }

  public getTransaction(id: TransactionId): Transaction | null {
    const logEntry = this.transactions.get(id)
    if (!logEntry) return null
    const transaction = logEntry.payload.value
    return {
      ...transaction,
      _id: logEntry.hash,
    }
  }

  /**
   * Enqueues an incoming transaction, i.e. holds back a transaction for a small amount of time,
   * thus reducing risk of doubled transactions, i.e. caused by replay attacks
   * @param transactionData The transaction data object
   */
  private enqueueTransaction(transactionData: TransactionData): void {
    const ProcessingDelay = 5 * Seconds
    this.orbitDbService.operationsQueue.enqueue(async () => {
      const isNew = this.isNewTransaction(transactionData, ProcessingDelay)
      if (!isNew) {
        logger.warn(`Discarding already existing transaction with hash: ${transactionData.hash}`)
        return
      }
      try {
        const id = await this.transactions.add(transactionData)
        logger.info(`Transaction [${transactionData.hash}] successfully recorded - id: ${id}`)
      } catch (e) {
        logger.error(e)
      }
    }, ProcessingDelay)
  }

  private isNewTransaction(transactionData: TransactionData, allowedTimeframe: number): boolean {
    const doubledTx = this.transactions
      .iterator({ limit: 25 })
      .collect()
      .filter(
        ({ payload: { value } }) =>
          value.hash === transactionData.hash &&
          transactionData.timestamp - value.timestamp < allowedTimeframe,
      )

    return doubledTx.length === 0
  }

  /**
   * Grants an account an arbitrary amount of points (make them appear from nowhere)
   * The sender must be of AccountRole.Admin, otherwise operation is not permitted
   * @param args The Arguments
   */
  public airdrop(args: TransactionArgs): void {
    if (!args.sender?.isOfRole(AccountRole.Admin)) {
      throw new NotAllowedError(`Account [${args.sender?._id}] has insufficient permission`)
    }

    // TODO: verify signature!

    const transactionData = TransactionService.createTransactionData(args)
    this.enqueueTransaction(transactionData)
  }

  private static createTransactionData(txArgs: TransactionArgs): TransactionData {
    let transactionData = {
      sender: txArgs.sender._id,
      recipient: txArgs.recipient._id,
      amount: txArgs.amount,
      message: txArgs.message,
      signature: txArgs.signature,
    }

    const hash = generateHash({
      message: JSON.stringify(transactionData),
    })

    return {
      ...transactionData,
      hash,
      timestamp: Date.now(),
    }
  }

  /**
   * Transfers an amount from one account to another
   * @param args The Arguments
   */
  public async transfer(args: TransactionArgs): Promise<void> {
    // 1 - validation
    // check senders balance
    // check timeframe (not here yet)
    // verify signature
    // verify tx with same signature

    // 2 - commit
    // add transaction
    // update balances

    const transactionData = TransactionService.createTransactionData(args)
    this.enqueueTransaction(transactionData)
  }
}
