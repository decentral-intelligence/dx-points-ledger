import { orbitDbService, TransactionService } from '../index'
import { config } from '../../../config'

export const provideTransactionService = (): TransactionService =>
  new TransactionService({
    orbitDbService,
    poolTimeout: config.get('transactionPool.timeout'),
    poolLimit: config.get('transactionPool.limit'),
    verifySignatures: config.get('verifySignatures'),
  })
