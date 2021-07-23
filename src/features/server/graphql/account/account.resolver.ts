import { accountTransactionsResolver } from './resolver/account/accountTransactionsResolver'
import { createAccountResolver } from './resolver/mutation/createAccountResolver'
import { allAccountsResolver } from './resolver/query/allAccountsResolver'
import { accountResolver } from './resolver/query/accountResolver'
import { accountByPublicKeyResolver } from './resolver/query/accountByPublicKeyResolver'
import { accountBalanceResolver } from './resolver/account/accountBalanceResolver'
import { accountByAliasResolver } from './resolver/query/accountByAliasResolver'

const AccountResolver = {
  Query: {
    accounts: allAccountsResolver,
    account: accountResolver,
    accountByPublicKey: accountByPublicKeyResolver,
    accountByAlias: accountByAliasResolver,
  },
  Mutation: {
    createAccount: createAccountResolver,
  },
  Account: {
    transactions: accountTransactionsResolver,
    balance: accountBalanceResolver,
  },
}

export default AccountResolver
