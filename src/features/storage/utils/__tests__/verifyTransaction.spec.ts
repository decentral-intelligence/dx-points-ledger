// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { createPrivateKey, generateKeyPairSync, sign } from 'crypto'
import { TransactionData } from '../../models/TransactionData'
import { verifyTransaction } from '../verifyTransaction'
import { AccountData } from '../../models/Account'
import { AccountRole } from '../../types/AccountRole'

describe('verifyTransaction', () => {
  let privKey: Buffer
  let pubKey: Buffer
  const TestSecret = 'TestSecret'

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
        passphrase: TestSecret,
      },
    })

    privKey = privateKey
    pubKey = publicKey
  })

  it('should correctly verify a valid transaction', () => {
    const sender: AccountData = {
      publicKey: pubKey.toString('base64'),
      _id: 'senderId',
      alias: 'Test Account',
      balance: 1000,
      isActive: true,
      role: AccountRole.Admin,
    }
    const transactionData: any = {
      message: 'Some message',
      sender: 'senderId',
      recipient: 'recipientId',
      amount: 1000,
    }
    const message = Buffer.from(stableStringify(transactionData))

    let keyObject = createPrivateKey({
      key: privKey,
      format: 'der',
      type: 'pkcs8',
      passphrase: TestSecret,
    })

    const signature = sign(null, message, keyObject)

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature: signature.toString('base64'),
    }

    expect(() => {
      verifyTransaction(signedTransaction, sender)
    }).not.toThrow()
  })

  it('should correctly verify a valid transaction', () => {
    const sender: AccountData = {
      publicKey: pubKey.toString('base64'),
      _id: 'senderId',
      alias: 'Test Account',
      balance: 1000,
      isActive: true,
      role: AccountRole.Admin,
    }
    const transactionData: any = {
      message: 'Some message',
      sender: 'senderId',
      recipient: 'recipientId',
      amount: 1000,
    }
    const message = Buffer.from(stableStringify(transactionData))

    let keyObject = createPrivateKey({
      key: privKey,
      format: 'der',
      type: 'pkcs8',
      passphrase: TestSecret,
    })

    const signature = sign(null, message, keyObject)

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature: signature.toString('base64'),
    }

    expect(() => {
      verifyTransaction(signedTransaction, sender)
    }).not.toThrow()
  })
})
