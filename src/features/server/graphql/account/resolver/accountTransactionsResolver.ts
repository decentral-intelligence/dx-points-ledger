import { provideAccountService } from './provideAccountService'
import { logger } from '../../../../@common/logger'
import { Account } from '@storage/models/Account'
import { Transaction } from '@storage/models/Transaction'

export const accountTransactionsResolver = (parent: Account, args: any): Transaction[] => {
  console.log('accountTransactionsResolver', parent, args)
  return []
}
