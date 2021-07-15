import { Crypto, CryptoKey } from '@peculiar/webcrypto'
export const crypto = new Crypto()

export interface CryptoKeyPair {
  publicKey: CryptoKey
  privateKey: CryptoKey
}

export const generateKeys = async (): Promise<CryptoKeyPair> => {
  return crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-521', // P-256, P-384, or P-521
    },
    true,
    ['sign', 'verify'],
  )
}

export const exportBase64Key = async (key: CryptoKey): Promise<string> => {
  const jwk = await crypto.subtle.exportKey('jwk', key)
  return Buffer.from(JSON.stringify(jwk)).toString('base64')
}
