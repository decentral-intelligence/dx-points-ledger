import EventStore from 'orbit-db-eventstore'
import { Transaction, TransactionId } from './models/Transaction'
import { DataSource } from 'apollo-datasource'
import { Account, AccountId } from './models/Account'
import { AccountRole } from './types/AccountRole'

export interface AirdropArgs {
  sender: Account
  recipient: Account
  amount: number
  reason?: string
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
    // TODO: treat unknown transactions
    const transaction = logEntry.payload.value
    return {
      ...transaction,
      _id: logEntry.hash,
    }
  }

  /**
   * Grants an account an arbitrary amount of points
   * The sender must be of AccountRole.Admin, otherwise operation is not permitted
   * @param args The Arguments
   * @return The hash/id of created transaction
   */
  public async airdrop(args: AirdropArgs): Promise<TransactionId> {
    if (!args.sender.isOfRole(AccountRole.Admin)) {
      throw Error('Insufficient Permission')
    }

    const transaction = {
      sender: args.sender._id,
      recipient: args.recipient._id,
      amount: args.amount,
      message: args.reason,
      timestamp: Date.now(),
    }

    return this.transactions.add(transaction)
  }
}
