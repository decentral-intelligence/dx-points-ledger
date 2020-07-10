const { sign, createPrivateKey } = require('crypto')
const { readFileSync } = require('fs')
const { prompt } = require('inquirer')
const stringify = require('json-stable-stringify')

const isAddress = (str) => /XPOINTZ-(\w{4}-){3}\w{5}/.test(str)

const addressValidator = (address) => (isAddress(address) ? true : 'Not a valid account')

const signTx = ({ encryptedPrivateKey, passphrase, ...data }) => {
  const message = Buffer.from(stringify(data))
  const decodedPrivateKey = Buffer.from(encryptedPrivateKey, 'base64')

  const privateKey = createPrivateKey({
    key: decodedPrivateKey,
    format: 'der',
    type: 'pkcs8',
    passphrase,
  })

  const signature = sign(null, message, privateKey)
  return signature.toString('base64')
}

;(async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'sender',
      message: "What's the senders id?",
      validate: addressValidator,
    },
    {
      type: 'input',
      name: 'recipient',
      message: "What's the recipients id?",
      validate: addressValidator,
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
