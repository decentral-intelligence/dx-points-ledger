import { AccountService, TransactionService } from '../../../storage'

export interface CustomApolloContext {
  key: string
  dataSources: {
    accounts: AccountService
    transactions: TransactionService
  }
}
