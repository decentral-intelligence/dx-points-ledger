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

  console.log('PUBLIC KEY')
  console.log(keys.publicKey)

  console.log('\nPRIVATE KEY (store in a safe place together with the passphrase)')
  console.log(keys.privateKey)
})()
