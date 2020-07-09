// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { generateKeyPairSync, sign } from 'crypto'
import { verifySignature } from '../verifySignature'

describe('verifySignature', () => {
  let privKey: Buffer
  let pubKey: Buffer
  const TestData = {
    foo: 'bar',
    baz: 42,
  }
  beforeAll(() => {
    // @ts-ignore
    const { publicKey, privateKey } = generateKeyPairSync('ed448')
    privKey = privateKey
    pubKey = publicKey
  })

  it('should correctly verify a valid signature', () => {
    const message = Buffer.from(stableStringify(TestData))
    const signature = sign(null, message, privKey)
    const isVerified = verifySignature({
      message,
      signerPublicKey: pubKey,
      signature,
    })
    expect(isVerified).toBeTruthy()
  })

  it('should return false for another public key', () => {
    const message = Buffer.from(stableStringify(TestData))

    // @ts-ignore
    const { publicKey: otherPublicKey } = generateKeyPairSync('ed448')
    const signature = sign(null, message, privKey)

    const isVerified = verifySignature({
      message,
      signerPublicKey: otherPublicKey,
      signature,
    })

    expect(isVerified).toBeFalsy()
  })
})
