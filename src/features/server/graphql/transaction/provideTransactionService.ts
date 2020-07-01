import { orbitDbService, TransactionService } from '../../../storage'

export const provideTransactionService = (): TransactionService =>
  new TransactionService(orbitDbService.transactions)
