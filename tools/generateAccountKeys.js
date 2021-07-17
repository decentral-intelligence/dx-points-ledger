const { writeFileSync } = require('fs')
const { Crypto } = require('@peculiar/webcrypto')

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
  const { publicKey, privateKey } = await generateKeys()
  const publicBase64Jwk = await exportBase64Jwk(publicKey)
  const privateBase64Jwk = await exportBase64Jwk(privateKey)

  const publicKeyPath = `publickey.b64`
  const privateKeyPath = `privatekey.b64`

  writeFileSync(publicKeyPath, publicBase64Jwk, 'utf-8')
  writeFileSync(privateKeyPath, privateBase64Jwk, 'utf-8')

  console.log('Keys saved successfully')
  console.log('---------------------------------------')
  console.log('Public Key:', publicBase64Jwk)
  console.log('Stored under:', publicKeyPath)
  console.log('---------------------------------------')
  console.log('Private Key:', privateBase64Jwk)
  console.log('Stored under:', privateKeyPath)
  console.log('Keep the private key file in a safe place together')
})()
