const { sign, createPrivateKey } = require('crypto')
const stringify = require('json-stable-stringify')

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

module.exports = {
  signTx,
}
