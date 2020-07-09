import { TransactionData } from '../models/TransactionData'
import { AccountData } from '../models/Account'
import { verifySignature } from '../../security/verifySignature'
// @ts-ignore
import stableStringify from 'json-stable-stringify'
import { NotAllowedError } from '../../../types/exceptions/NotAllowedError'

export const verifyTransaction = (
  transaction: TransactionData,
  senderAccount: AccountData,
): void => {
  const { recipient, amount, message, sender } = transaction
  const digest = Buffer.from(
    stableStringify({
      recipient,
      sender,
      amount,
      message,
    }),
  )
  const isVerified = verifySignature({
    message: digest,
    signerPublicKey: senderAccount.publicKey,
    signature: Buffer.from(transaction.signature, 'base64'),
  })

  if (!isVerified) {
    throw new NotAllowedError(`Transaction cannot be verified: ${JSON.stringify(transaction)}`)
  }
}
