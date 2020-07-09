import { TransactionData } from '../models/TransactionData'
import { AccountData } from '../models/Account'
import { verifySignature } from '../../security/verifySignature'
// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { NotAllowedError } from '../../../types/exceptions/NotAllowedError'
import { createPublicKey } from 'crypto'

export const verifyTransaction = (
  transaction: TransactionData,
  senderAccount: AccountData,
): void => {
  const { recipient, amount, message, sender } = transaction
  const digest = Buffer.from(
    stableStringify({
      message,
      sender,
      recipient,
      amount,
    }),
  )

  const signerPublicKey = createPublicKey({
    key: Buffer.from(senderAccount.publicKey, 'base64'),
    type: 'spki',
    format: 'der',
  })

  const isVerified = verifySignature({
    message: digest,
    signerPublicKey,
    signature: Buffer.from(transaction.signature, 'base64'),
  })

  if (!isVerified) {
    throw new NotAllowedError(`Transaction cannot be verified: ${JSON.stringify(transaction)}`)
  }
}
