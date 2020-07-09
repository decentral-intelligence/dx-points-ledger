import { createHash } from 'crypto'
import { encodeReedSolomon } from '../../security/encodeReedSolomon'

export const getAccountIdFromPublicKey = (publicKey: string): string => {
  const hash = createHash('sha256')
  hash.update(publicKey)
  const digest = hash.digest('hex')
  return encodeReedSolomon('XPOINTZ', digest)
}
