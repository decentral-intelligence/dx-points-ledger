import { AccountService } from '../AccountService'
import { orbitDbService } from '../index'

export const provideAccountService = (): AccountService =>
  new AccountService(orbitDbService.accounts)
