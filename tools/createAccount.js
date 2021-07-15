const { prompt } = require('inquirer')
const { writeFileSync } = require('fs')
const { Crypto } = require('@peculiar/webcrypto')
const { createAccount } = require('./api/createAccount')

const crypto = new Crypto()

const generateKeys = async () => {
  const keys = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-521', // P-256, P-384, or P-521
    },
    true,
    ['sign', 'verify'],
  )

  return keys
}

const exportBase64Jwk = async (key) => {
  const jwk = await crypto.subtle.exportKey('jwk', key)
  return Buffer.from(JSON.stringify(jwk)).toString('base64')
}

;(async () => {
  const answers = await prompt([
    {
      type: 'list',
      name: 'role',
      message: "What's the new accounts role?",
      choices: ['Admin', 'Common'],
    },
    {
      type: 'input',
      name: 'alias',
      message: "If you want, what's the accounts alias?",
    },
  ])

  const { role, alias } = answers
  const { publicKey, privateKey } = await generateKeys()
  const publicBase64Jwk = await exportBase64Jwk(publicKey)
  const privateBase64Jwk = await exportBase64Jwk(privateKey)

  const response = await createAccount({
    publicKey: publicBase64Jwk,
    role,
    alias,
  })

  if (response.statusCode !== 200) {
    console.error('Ah snap', response.message)
    return
  }

  const { createAccount: newAccount } = response.data

  console.log('Account created', newAccount)

  const publicKeyPath = `${newAccount._id}.publickey.b64`
  const privateKeyPath = `${newAccount._id}.privatekey.b64`

  writeFileSync(publicKeyPath, publicBase64Jwk, 'utf-8')
  writeFileSync(privateKeyPath, privateBase64Jwk, 'utf-8')

  console.log('Keys saved successfully')
  console.log('Public Key:', publicKeyPath)
  console.log('Private Key:', privateKeyPath)
  console.log('Keep the private key file in a safe place together')
})()
