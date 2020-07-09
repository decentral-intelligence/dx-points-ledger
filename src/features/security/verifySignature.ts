import { createVerify } from 'crypto'

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
  signerPublicKey: string
  /**
   * The algorithm used while signing, defaults to 'sha512'
   */
  algorithm?: 'sha256' | 'sha384' | 'sha512'
}

/**
 * Verifies a cryptographic signature
 * @param args
 */
export const verifySignature = (args: VerifyArgs): boolean => {
  const { message, signature, signerPublicKey, algorithm = 'sha512' } = args
  const verifier = createVerify(algorithm)
  verifier.update(message)
  verifier.end()
  return verifier.verify(signerPublicKey, signature)
}
