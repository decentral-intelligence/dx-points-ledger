import { createHash, HexBase64Latin1Encoding } from 'crypto'

type HashingAlgorithm = 'sha256' | 'sha384' | 'sha512' | 'ripemd160'

interface HashArgs {
  message: string
  algorithm?: HashingAlgorithm
  encoding?: HexBase64Latin1Encoding
}

// FIXME: write tests
export const generateHash = (args: HashArgs): string => {
  const { algorithm = 'sha256', encoding = 'base64', message } = args
  const hash = createHash(algorithm)
  hash.update(message)
  return hash.digest(encoding)
}
