import EventStore from 'orbit-db-eventstore'
import { Transaction, TransactionId } from './models/Transaction'
import { DataSource } from 'apollo-datasource'
import { Account, AccountId } from './models/Account'
import { AccountRole } from './types/AccountRole'
import { NotAllowedError } from '../../types/exceptions/NotAllowedError'

export interface TransactionArgs {
  sender: Account
  recipient: Account
  amount: number
  message?: string
  signature: string
}

export class TransactionService extends DataSource {
  constructor(private transactions: EventStore<Transaction>) {
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
   * Grants an account an arbitrary amount of points (make them appear from nowhere)
   * The sender must be of AccountRole.Admin, otherwise operation is not permitted
   * @param args The Arguments
   * @return The hash/id of created transaction
   */
  public async airdrop(args: TransactionArgs): Promise<TransactionId> {
    if (!args.sender?.isOfRole(AccountRole.Admin)) {
      throw new NotAllowedError(`Account [${args.sender?._id}] has insufficient permission`)
    }

    // TODO: verify signature!

    const transaction = {
      sender: args.sender._id,
      recipient: args.recipient._id,
      amount: args.amount,
      message: args.message,
      signature: args.signature,
      timestamp: Date.now(),
    }

    return this.transactions.add(transaction)
  }

  /**
   * Transfers an amount from one account to another
   * @param args The Arguments
   * @return The hash/id of created transaction
   */
  public async transfer(args: TransactionArgs): Promise<TransactionId> {
    // 1 - validation
    // check senders balance
    // check timeframe (not here yet)
    // verify signature
    // verify tx with same signature

    // 2 - commit
    // add transaction
    // update balances

    const transaction = {
      sender: args.sender._id,
      recipient: args.recipient._id,
      amount: args.amount,
      message: args.message,
      signature: args.signature,
      timestamp: Date.now(),
    }

    return this.transactions.add(transaction)
  }
}
