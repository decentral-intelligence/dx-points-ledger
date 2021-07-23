const { prompt } = require('inquirer')
const { readFileSync } = require('fs')
const { accountValidator } = require('./common/accountValidator')
const { signTx } = require('./common/signTx')
const { transferPoints } = require('./api/transferPoints')
const { airdropPoints } = require('./api/airdropPoints')
const { fetchAccount } = require('./api/fetchAccount')

const enhancedAccountValidator = async (accountId) => {
  const isValidAccountId = accountValidator(accountId)
  if (isValidAccountId !== true) return Promise.resolve(isValidAccountId)

  const { data } = await fetchAccount(accountId)
  if (data.account === null) return Promise.resolve('Account does not exist')

  return true
}

;(async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'sender',
      message: "What's the senders id?",
      validate: enhancedAccountValidator,
    },
    {
      type: 'input',
      name: 'recipient',
      message: "What's the recipients id?",
      validate: enhancedAccountValidator,
    },
    {
      type: 'number',
      name: 'amount',
      message: "What's the amount to send?",
      validate: (input) => (input > 0 ? true : 'Only positive values are allowed'),
    },
    {
      type: 'confirm',
      name: 'isAirdrop',
      message: 'Do you want to airdrop the amount?',
      default: false,
    },
    {
      type: 'input',
      name: 'message',
      message: 'Enter an additional message',
      default: null,
    },
    {
      type: 'input',
      name: 'pkpath',
      message: 'The private keys file path',
      default: './privatekey.b64',
    },
  ])

  const { sender, amount, message, recipient, pkpath, isAirdrop } = answers
  const privateKeyBase64 = readFileSync(pkpath, 'utf-8')
  const signingJwk = JSON.parse(Buffer.from(privateKeyBase64, 'base64').toString('utf-8'))
  const signature = await signTx({ sender, recipient, amount, message, signingJwk })

  const payload = {
    sender,
    recipient,
    amount,
    message,
    signature,
  }

  const response = await (isAirdrop ? airdropPoints(payload) : transferPoints(payload))
  if (response.statusCode === 200) {
    console.log('Transfer enqueued', response.data.airdropPoints || response.data.transferPoints)
  } else {
    console.error('Ah snap:', response.message)
  }
})()
