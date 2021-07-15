// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { Crypto } from '@peculiar/webcrypto'
import { verifySignature } from './verifySignature'
import { NotAllowedError } from '../../types/exceptions/NotAllowedError'
import { TransactionData } from '../storage/models/TransactionData'
import { AccountData } from '../storage/models/Account'
import { ECDSAParameters } from './securityParameters'

const crypto = new Crypto()

export const verifyTransaction = async (
  transaction: TransactionData,
  senderAccount: AccountData,
): Promise<void> => {
  const { recipient, amount, message, sender } = transaction
  const digest = Buffer.from(
    stableStringify({
      message,
      sender,
      recipient,
      amount,
    }),
  )
  const publicKeyJwk = JSON.parse(Buffer.from(senderAccount.publicKey, 'base64').toString('utf-8'))
  const signature = Buffer.from(transaction.signature, 'base64')
  const publicKey = await crypto.subtle.importKey('jwk', publicKeyJwk, ECDSAParameters, false, [
    'verify',
  ])
  const isVerified = await verifySignature({
    data: digest,
    publicKey,
    signature,
  })

  if (!isVerified) {
    throw new NotAllowedError(`Transaction cannot be verified: ${JSON.stringify(transaction)}`)
  }
}
