import { verify } from 'crypto'
import { logger } from '../@common/logger'

interface VerifyArgs {
  /**
   * The signed message
   */
  message: Buffer
  /**
   * The signature for the related message
   */
  signature: Buffer
  /**
   * The signers public key
   */
  signerPublicKey: string | Buffer
}

/**
 * Verifies a cryptographic signature
 * @param args
 */
export const verifySignature = (args: VerifyArgs): boolean => {
  try {
    const { message, signature, signerPublicKey } = args
    return verify(null, message, signerPublicKey, signature)
  } catch (e) {
    logger.error('Signature Verification failed')
    return false
  }
}
