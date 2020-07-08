import { orbitDbService, TransactionService } from '../index'
import { Seconds } from './constants'

export const provideTransactionService = (): TransactionService =>
  new TransactionService({
    orbitDbService,
    poolTimeout: 5 * Seconds,
    poolTxLimit: 10,
  })
