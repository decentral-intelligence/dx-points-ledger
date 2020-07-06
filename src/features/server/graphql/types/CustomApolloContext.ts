import { AccountService, TransactionService } from '../../../storage'

export interface CustomApolloContext {
  dataSources: {
    accounts: AccountService
    transactions: TransactionService
  }
}
