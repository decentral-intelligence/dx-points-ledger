const { prompt } = require('inquirer')
const { writeFileSync } = require('fs')
const { generateKeyPairSync } = require('crypto')
const { createAccount } = require('./api/createAccount')

const MinimumPassphraseLength = 10

const generateKeys = (passphrase) => {
  const { publicKey, privateKey } = generateKeyPairSync('ed448', {
    publicKeyEncoding: {
      type: 'spki',
      format: 'der',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der',
      cipher: 'aes-256-cbc',
      passphrase,
    },
  })

  return {
    publicKey: publicKey.toString('base64'),
    privateKey: privateKey.toString('base64'),
  }
}

const passphraseValidator = (passphrase) => {
  return passphrase.length < MinimumPassphraseLength
    ? `Passphrase must have a least ${MinimumPassphraseLength} characters`
    : true
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
    {
      type: 'password',
      name: 'passphrase',
      message: 'Enter a password to protect your private key',
      validate: passphraseValidator,
    },
  ])

  const { role, passphrase, alias } = answers
  const { publicKey, privateKey } = generateKeys(passphrase)

  const response = await createAccount({
    publicKey,
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
  const privateKeyPath = `${newAccount._id}.privatekey.enc.b64`

  writeFileSync(publicKeyPath, publicKey, 'utf-8')
  writeFileSync(privateKeyPath, privateKey, 'utf-8')

  console.log('Keys saved successfully')
  console.log('Public Key:', publicKeyPath)
  console.log('Private Key:', privateKeyPath)
  console.log('Keep the private key file in a safe place together with the used passphrase')
})()
