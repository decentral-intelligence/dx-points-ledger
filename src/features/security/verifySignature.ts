import { Crypto, CryptoKey } from '@peculiar/webcrypto'
import { SigningAlgorithm } from './securityParameters'

const crypto = new Crypto()

interface VerifyArgs {
  /**
   * The signed data
   */
  data: Buffer
  /**
   * The signature for the related message
   */
  signature: Buffer
  /**
   * The signers public key
   */
  publicKey: CryptoKey
}

/**
 * Verifies a cryptographic signature
 * @param args
 */
export const verifySignature = (args: VerifyArgs): Promise<boolean> => {
  const { data, signature, publicKey } = args
  return crypto.subtle.verify(SigningAlgorithm, publicKey, signature, data)
}
