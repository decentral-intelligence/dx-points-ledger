// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { Crypto, CryptoKey } from '@peculiar/webcrypto'
import { verifySignature } from '../verifySignature'
import { ECDSAParameters, SigningAlgorithm } from '../securityParameters'

interface CryptoKeyPair {
  publicKey: CryptoKey
  privateKey: CryptoKey
}

const crypto = new Crypto()

describe('verifySignature', () => {
  let keys: CryptoKeyPair
  const TestData = {
    foo: 'bar',
    baz: 42,
  }
  beforeAll(async () => {
    keys = await crypto.subtle.generateKey(ECDSAParameters, false, ['sign', 'verify'])
  })

  it('should correctly verify a valid signature', async () => {
    const data = Buffer.from(stableStringify(TestData))
    const signature = await crypto.subtle.sign(SigningAlgorithm, keys.privateKey, data)
    const isVerified = await verifySignature({
      data,
      publicKey: keys.publicKey,
      signature,
    })

    expect(isVerified).toBeTruthy()
  })

  it('should return false for another public key', async () => {
    const data = Buffer.from(stableStringify(TestData))

    const otherKeys = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-521',
      },
      false,
      ['sign', 'verify'],
    )
    const signature = await crypto.subtle.sign(SigningAlgorithm, keys.privateKey, data)
    const isVerified = await verifySignature({
      data,
      publicKey: otherKeys.publicKey,
      signature,
    })

    expect(isVerified).toBeFalsy()
  })
})
