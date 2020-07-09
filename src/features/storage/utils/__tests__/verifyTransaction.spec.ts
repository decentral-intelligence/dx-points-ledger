// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { createSign, generateKeyPairSync } from 'crypto'
import { TransactionData } from '../../models/TransactionData'
import { verifyTransaction } from '../verifyTransaction'
import { AccountData } from '../../models/Account'
import { AccountRole } from '../../types/AccountRole'

describe('verifyTransaction', () => {
  let privKey: string
  let pubKey: string
  const TestSecret = 'TestSecret'

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

  it('should correctly verify a valid transaction', () => {
    const sender: AccountData = {
      publicKey: pubKey,
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
    const signer = createSign('sha512')
    signer.update(message)
    signer.end()

    const signature = signer.sign({
      key: privKey,
      passphrase: TestSecret,
    })

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature,
    }

    expect(() => {
      verifyTransaction(signedTransaction, sender)
    }).not.toThrow()
  })

  it('should correctly throw exception for an invalid transaction', () => {
    const sender: AccountData = {
      publicKey: 'Some invalid pubkey',
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
    const signer = createSign('sha512')
    signer.update(message)
    signer.end()

    const signature = signer.sign({
      key: privKey,
      passphrase: TestSecret,
    })

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature,
    }

    expect(() => {
      verifyTransaction(signedTransaction, sender)
    }).toThrow()
  })
})
