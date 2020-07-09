// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign } from 'crypto'
import { verifySignature } from '../verifySignature'

describe('verifySignature', () => {
  let privKey: Buffer
  let pubKey: Buffer
  const Passphrase = 'Passphrase'
  const TestData = {
    foo: 'bar',
    baz: 42,
  }
  beforeAll(() => {
    // @ts-ignore
    const { publicKey, privateKey } = generateKeyPairSync('ed448', {
      publicKeyEncoding: {
        type: 'spki',
        format: 'der',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der',
        cipher: 'aes-256-cbc',
        passphrase: Passphrase,
      },
    })

    privKey = privateKey
    pubKey = publicKey
  })

  it('should correctly verify a valid signature', () => {
    const message = Buffer.from(stableStringify(TestData))
    const privateKey = createPrivateKey({
      key: privKey,
      type: 'pkcs8',
      format: 'der',
      passphrase: Passphrase,
    })
    const signature = sign(null, message, privateKey)
    const signerPublicKey = createPublicKey({
      key: pubKey,
      type: 'spki',
      format: 'der',
    })

    const isVerified = verifySignature({
      message,
      signerPublicKey,
      signature,
    })

    expect(isVerified).toBeTruthy()
  })

  it('should return false for another public key', () => {
    const message = Buffer.from(stableStringify(TestData))

    // @ts-ignore
    const { publicKey: otherPublicKey } = generateKeyPairSync('ed448')
    const privateKey = createPrivateKey({
      key: privKey,
      type: 'pkcs8',
      format: 'der',
      passphrase: Passphrase,
    })
    const signature = sign(null, message, privateKey)

    const isVerified = verifySignature({
      message,
      signerPublicKey: otherPublicKey,
      signature,
    })

    expect(isVerified).toBeFalsy()
  })
})
