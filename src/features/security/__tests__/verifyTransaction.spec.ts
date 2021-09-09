import stableStringify from 'json-stable-stringify'
import { verifyTransaction } from '../verifyTransaction'
import { AccountData } from '../../storage/models/Account'
import { AccountRole } from '../../storage/types/AccountRole'
import { TransactionData } from '../../storage/models/TransactionData'
import { CryptoKeyPair, crypto, exportBase64Key, generateKeys } from './testCrypto'
import { SigningAlgorithm } from '../securityParameters'

describe('verifyTransaction', () => {
  let keys: CryptoKeyPair

  beforeAll(async () => {
    keys = await generateKeys()
  })

  it('should correctly verify a valid transaction', async () => {
    const publicKey = await exportBase64Key(keys.publicKey)
    const sender: AccountData = {
      publicKey,
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
    const signature = await crypto.subtle.sign(SigningAlgorithm, keys.privateKey, message)

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature: Buffer.from(signature).toString('base64'),
    }

    try {
      await verifyTransaction(signedTransaction, sender)
    } catch (e) {
      expect('Should ot throw error').toBeFalsy()
    }
  })

  it('should reject if transaction cannot be verified', async () => {
    const otherKeys = await generateKeys()
    const publicKey = await exportBase64Key(otherKeys.publicKey)

    const sender: AccountData = {
      publicKey,
      _id: 'senderId',
      alias: 'Test Account',
      balance: 1000,
      isActive: true,
      role: AccountRole.Admin,
    }
    const transactionData = {
      message: 'Some message',
      sender: 'senderId',
      recipient: 'recipientId',
      amount: 1000,
    }

    const message = Buffer.from(stableStringify(transactionData))
    const signature = await crypto.subtle.sign(SigningAlgorithm, keys.privateKey, message)

    const signedTransaction: TransactionData = {
      ...transactionData,
      hash: 'somehash',
      timestamp: 1000,
      signature: Buffer.from(signature).toString('base64'),
      tags: [],
    }

    try {
      await verifyTransaction(signedTransaction, sender)
      expect('Should throw error').toBeFalsy()
    } catch (e: any) {
      expect(e.message).toContain('Transaction cannot be verified:')
    }
  })
})
