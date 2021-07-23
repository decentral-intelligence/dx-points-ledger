const stableStringify = require('json-stable-stringify')
const { Crypto } = require('@peculiar/webcrypto')
const { SignAlgorithm, ECDSAParameters } = require('../common/cryptoParameters')

const crypto = new Crypto()

const signTx = async ({ signingJwk, ...jsonData }) => {
  const signingKey = await crypto.subtle.importKey('jwk', signingJwk, ECDSAParameters, false, [
    'sign',
  ])
  const data = Buffer.from(stableStringify(jsonData))
  const signature = await crypto.subtle.sign(SignAlgorithm, signingKey, data)
  return Buffer.from(signature).toString('base64')
}

module.exports = {
  signTx,
}
