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

export interface TransactionArgs {
  sender: Account
  recipient: Account
  amount: number
  message?: string
  signature: string
}

export class TransactionService extends DataSource {
  constructor(private transactions: EventStore<TransactionData>) {
    super()
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
   * thus reducing risk of replay attacks
   * @param transactionData The transaction data object
   */
  // TODO: make testable
  private enqueueTransaction(transactionData: TransactionData): void {
    setTimeout(async () => {
      const doubledTx = this.transactions
        .iterator({ limit: 25 })
        .collect()
        .filter(({ payload: { value } }) => value.hash === transactionData.hash)
      if (doubledTx.length === 0) {
        await this.transactions.add(transactionData)
      } else {
        logger.error(`Discarding already existing transaction with hash: ${transactionData.hash}`)
      }
    }, 5 * Seconds)
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
