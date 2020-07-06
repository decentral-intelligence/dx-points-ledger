const { createSign } = require('crypto')
const { readFileSync } = require('fs')
const { prompt } = require('inquirer')

const isAddress = (str) => /XPOINTZ-(\w{4}-){3}\w{5}/.test(str)

const addressValidator = (address) => (isAddress(address) ? true : 'Not a valid account')

const sign = ({ privateKey, passphrase, ...data }) => {
  const message = Buffer.from(JSON.stringify(data))
  const signer = createSign('sha512')
  signer.update(message)
  signer.end()

  const signature = signer.sign({
    key: privateKey,
    passphrase,
  })

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
      name: 'receiver',
      message: "What's the receivers id?",
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
      default: './privatekey.pem',
    },
    {
      type: 'password',
      name: 'passphrase',
      message: 'The passphrase for the private key',
    },
  ])

  const { sender, amount, message, receiver, passphrase, pkpath } = answers
  const privateKey = readFileSync(pkpath, 'utf-8')
  const signature = sign({ sender, receiver, amount, message, privateKey, passphrase })

  console.log('\nSigned Transaction\n', {
    sender,
    receiver,
    amount,
    message,
    signature,
  })
})()
