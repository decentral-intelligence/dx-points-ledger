const { writeFileSync } = require('fs')
const { prompt } = require('inquirer')
const { generateKeyPairSync } = require('crypto')

const MinimumPassphraseLength = 10

const generateKeys = (passphrase) => {
  if (passphrase.length < MinimumPassphraseLength) {
    throw new Error(`Passphrase must have a least ${MinimumPassphraseLength} characters`)
  }

  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'sect571r1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase,
    },
  })

  return {
    publicKey,
    privateKey,
  }
}

;(async () => {
  const { passphrase } = await prompt([
    {
      type: 'password',
      name: 'passphrase',
    },
  ])

  const keys = generateKeys(passphrase)

  writeFileSync('publickey.pem', keys.publicKey, 'utf-8')
  writeFileSync('privatekey.pem', keys.privateKey, 'utf-8')

  console.log('Keys stored successfully')
  console.log(
    'Store them in a safe place together with the used passphrase for the encrypted private key',
  )
  console.log('The public key is used for account creation')
  console.log(keys.publicKey)
})()
