const { writeFileSync } = require('fs')
const { prompt } = require('inquirer')
const { generateKeyPairSync } = require('crypto')

const MinimumPassphraseLength = 10

const generateKeys = (passphrase) => {
  if (passphrase.length < MinimumPassphraseLength) {
    throw new Error(`Passphrase must have a least ${MinimumPassphraseLength} characters`)
  }

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

  const publickeyB64 = keys.publicKey.toString('base64')
  const privatekeyB64 = keys.privateKey.toString('base64')
  const publickeyPath = 'publickey.b64'
  const privatekeyPath = 'privatekey.enc.b64'

  writeFileSync(publickeyPath, publickeyB64, 'utf-8')
  writeFileSync(privatekeyPath, privatekeyB64, 'utf-8')

  console.log('Keys stored successfully')
  console.log('Public Key:', publickeyPath)
  console.log('Private Key:', privatekeyPath)
  console.log(
    'Store them in a safe place together with the used passphrase for the encrypted private key',
  )
  console.log(
    'The public key is used for account creation, while the private is used for transaction signing',
  )

  console.log('------------ PUBLIC KEY ------------------')
  console.log(publickeyB64)
})()
