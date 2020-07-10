const { readFileSync } = require('fs')
const { prompt } = require('inquirer')
const { signTx } = require('./common/signTx')
const { accountValidator } = require('./common/accountValidator')

;(async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'sender',
      message: "What's the senders id?",
      validate: accountValidator,
    },
    {
      type: 'input',
      name: 'recipient',
      message: "What's the recipients id?",
      validate: accountValidator,
    },
    {
      type: 'number',
      name: 'amount',
      message: "What's the amount to send?",
      validate: (input) => (input > 0 ? true : 'Only positive values are allowed'),
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
      default: './privatekey.enc.b64',
    },
    {
      type: 'password',
      name: 'passphrase',
      message: 'The passphrase for the private key',
    },
  ])

  const { sender, amount, message, recipient, passphrase, pkpath } = answers
  const encryptedPrivateKey = readFileSync(pkpath, 'utf-8')
  const signature = signTx({ sender, recipient, amount, message, encryptedPrivateKey, passphrase })

  console.log('\nSigned Transaction\n', {
    sender,
    recipient,
    amount,
    message,
    signature,
  })
})()
