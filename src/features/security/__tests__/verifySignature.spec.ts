// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { createSign, generateKeyPairSync } from 'crypto'
import { verifySignature } from '../verifySignature'

describe('verifySignature', () => {
  let privKey: string
  let pubKey: string
  const TestSecret = 'TestSecret'
  const TestData = {
    foo: 'bar',
    baz: 42,
  }
  beforeAll(() => {
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
        passphrase: TestSecret,
      },
    })

    privKey = privateKey
    pubKey = publicKey
  })

  it('should correctly verify a valid signature', () => {
    const message = Buffer.from(stableStringify(TestData))
    const signer = createSign('sha512')
    signer.update(message)
    signer.end()

    const signature = signer.sign({
      key: privKey,
      passphrase: TestSecret,
    })

    const isVerified = verifySignature({
      message,
      signerPublicKey: pubKey,
      signature,
      algorithm: 'sha512',
    })

    expect(isVerified).toBeTruthy()
  })

  it('should return false for another public key', () => {
    const message = Buffer.from(stableStringify(TestData))
    const signer = createSign('sha512')
    signer.update(message)
    signer.end()

    const { publicKey: otherPublicKey } = generateKeyPairSync('ec', {
      namedCurve: 'sect571r1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: TestSecret,
      },
    })

    const signature = signer.sign({
      key: privKey,
      passphrase: TestSecret,
    })

    const isVerified = verifySignature({
      message,
      signerPublicKey: otherPublicKey,
      signature,
      algorithm: 'sha512',
    })

    expect(isVerified).toBeFalsy()
  })
})
