import { generateKeyPairSync, verify, sign, createSign, createVerify, getCurves } from 'crypto'

describe('signing tests', () => {
  it('some experiment', () => {
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
        passphrase: 'top secret',
      },
    })

    const data = {
      foo: 'bar',
    }
    const message = Buffer.from(JSON.stringify(data))
    const signer = createSign('sha512')
    signer.update(message)
    signer.end()

    const signature = signer.sign({
      key: privateKey,
      passphrase: 'top secret',
    })
    const serializedSignature = signature.toString('base64')

    const verifier = createVerify('sha512')
    verifier.update(message)
    verifier.end()

    let recreatedSignature = Buffer.from(serializedSignature, 'base64')

    const verified = verifier.verify(publicKey, recreatedSignature)

    expect(verified).toBeTruthy
  })
})
