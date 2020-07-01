import EventStore from 'orbit-db-eventstore'
import { Transaction } from './models/Transaction'

export class TransactionService {
  constructor(private transactions: EventStore<Transaction>) {}

  public getTransactionsOfAccount(userId: string): Transaction[] {
    return this.transactions
      .iterator({ limit: -1 })
      .collect()
      .filter(({ payload: { value } }) => value.sender === userId || value.recipient === userId)
      .map(({ payload: { value } }) => value)
  }
}
