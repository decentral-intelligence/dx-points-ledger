import { AccountService, orbitDbService } from '../../../../storage'

export const provideAccountService = (): AccountService =>
  new AccountService(orbitDbService.accounts)
