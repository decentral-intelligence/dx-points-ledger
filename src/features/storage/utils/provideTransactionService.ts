import { orbitDbService, TransactionService } from '../index'

export const provideTransactionService = (): TransactionService =>
  new TransactionService(orbitDbService.transactions)
