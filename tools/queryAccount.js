const { prompt } = require('inquirer')
const { fetchAccount } = require('./api/fetchAccount')
const { accountValidator } = require('./common/accountValidator')

;(async () => {
  const { accountId } = await prompt([
    {
      type: 'input',
      name: 'accountId',
      message: "What's the accounts id?",
      validate: accountValidator,
    },
  ])

  const { data } = await fetchAccount(accountId)
  if (data.account) {
    console.log(data.account)
  } else {
    console.error(`Account ${accountId} does not exist`)
  }
})()
