// @ts-ignore
import stableStringify from 'json-stable-stringify'
import EventStore from 'orbit-db-eventstore'
import { Transaction, TransactionId } from './models/Transaction'
import { DataSource } from 'apollo-datasource'
import { Account, AccountId } from './models/Account'
import { AccountRole } from './types/AccountRole'
import { NotAllowedError } from '../../types/exceptions/NotAllowedError'
import { generateHash } from '../security/generateHash'
import { logger } from '../@common/logger'
import { TransactionData } from './models/TransactionData'
import { OrbitDbService } from './OrbitDbService'
import { MemoryPool, verifyTransaction } from './utils'
import { TransactionsTags } from './utils/constants'

export interface TransactionArgs {
  sender: Account
  recipient: Account
  amount: number
  message?: string
  signature: string
  tags?: string[]
}

interface TransactionServiceOptions {
  orbitDbService: OrbitDbService
  poolTimeout: number
  poolLimit: number
  verifySignatures: boolean
}

/**
 * Class to handle transactions
 */
export class TransactionService extends DataSource {
  private transactions: EventStore<TransactionData>
  private transactionsPoolSingleton: MemoryPool<TransactionData>

  constructor(private options: TransactionServiceOptions) {
    super()
    this.transactions = options.orbitDbService.transactions
    this.transactionsPoolSingleton = options.orbitDbService.transactionsPool
    if (!this.transactionsPoolSingleton.isInitialized) {
      this.transactionsPoolSingleton.initialize({
        limit: options.poolLimit,
        timeout: options.poolTimeout,
        action: this.addTransactions.bind(this),
        dedupeFn: (entry, otherEntry) => entry.hash === otherEntry.hash,
      })
    }
  }

  public async drop(): Promise<void> {
    return this.transactions.drop()
  }

  // TODO: this method does not scale... need to limit somehow, once codebase grew
  public getTransactionsOfAccount(accountId: AccountId): Transaction[] {
    return this.transactions
      .iterator({ limit: -1 })
      .collect()
      .filter(
        ({ payload: { value } }) => value.sender === accountId || value.recipient === accountId,
      )
      .map(({ payload: { value }, hash }) => ({
        ...value,
        _id: hash,
      }))
  }

  public calculateBalanceOfAccount(accountId: AccountId): number {
    const transactions = this.getTransactionsOfAccount(accountId)
    return transactions.reduce((balance, { amount, sender, tags }) => {
      if (sender === accountId) {
        const isAirdrop = tags.includes(TransactionsTags.Airdrop)
        return isAirdrop ? balance : balance - amount
      }
      return balance + amount
    }, 0)
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
   * Grants an account an arbitrary amount of points (make them appear from nowhere)
   * The sender must be of AccountRole.Admin, otherwise operation is not permitted
   * @param args The Arguments
   */
  public airdrop(args: TransactionArgs): void {
    if (!args.sender?.isOfRole(AccountRole.Admin)) {
      throw new NotAllowedError(`Account [${args.sender?._id}] has insufficient permission`)
    }

    if (args.amount <= 0) {
      throw new NotAllowedError(`Amount must be greater than zero`)
    }

    args.tags = args.tags ?? []
    args.tags.push(TransactionsTags.Airdrop)

    const transactionData = TransactionService.createTransactionData(args)
    if (this.options.verifySignatures) {
      verifyTransaction(transactionData, args.sender)
    }

    this.transactionsPoolSingleton.addEntry(transactionData)
  }

  /**
   * Transfers an amount from one account to another
   * @param args The Arguments
   */
  public async transfer(args: TransactionArgs): Promise<void> {
    const { sender } = args
    const transactionData = TransactionService.createTransactionData(args)

    if (transactionData.amount <= 0) {
      throw new NotAllowedError(`Amount must be greater than zero`)
    }

    const senderBalance = this.calculateBalanceOfAccount(sender._id)
    if (senderBalance < transactionData.amount) {
      throw new NotAllowedError(`Account [${sender._id}] has insufficient balance`)
    }

    if (this.options.verifySignatures) {
      verifyTransaction(transactionData, args.sender)
    }

    this.transactionsPoolSingleton.addEntry(transactionData)
  }

  private async addTransactions(transactions: TransactionData[]): Promise<void> {
    for (const t of transactions) {
      await this.addSingleTransaction(t)
    }
  }

  private async addSingleTransaction(transactionData: TransactionData): Promise<void> {
    let isNew = await this.isNewTransaction(transactionData)
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
  }

  private isNewTransaction(transactionData: TransactionData): boolean {
    const allowedTimeframe = this.options.poolTimeout
    const identicalTransactions = this.transactions
      .iterator({ limit: 25 })
      .collect()
      .filter(
        ({ payload: { value } }) =>
          value.hash === transactionData.hash &&
          transactionData.timestamp - value.timestamp < allowedTimeframe,
      )
    return identicalTransactions.length === 0
  }

  private static createTransactionData(txArgs: TransactionArgs): TransactionData {
    let transactionData = {
      sender: txArgs.sender._id,
      recipient: txArgs.recipient._id,
      amount: txArgs.amount,
      message: txArgs.message,
      signature: txArgs.signature,
      tags: txArgs.tags || [],
    }

    const hash = generateHash({
      message: stableStringify(transactionData),
    })

    return {
      ...transactionData,
      hash,
      timestamp: Date.now(),
    }
  }
}
