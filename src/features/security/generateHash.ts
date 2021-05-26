import { createHash } from 'crypto'

type HashingAlgorithm = 'sha256' | 'sha384' | 'sha512' | 'ripemd160'
type HashEncoding = 'hex' | 'base64'

interface HashArgs {
  message: string
  algorithm?: HashingAlgorithm
  encoding?: HashEncoding
}

// FIXME: write tests
export const generateHash = (args: HashArgs): string => {
  const { algorithm = 'sha256', encoding = 'base64', message } = args
  const hash = createHash(algorithm)
  hash.update(message)
  return hash.digest(encoding)
}
