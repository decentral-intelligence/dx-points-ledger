// tslint:disable:no-bitwise

const initialCodeword = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const gexp: number[] = [
  1,
  2,
  4,
  8,
  16,
  5,
  10,
  20,
  13,
  26,
  17,
  7,
  14,
  28,
  29,
  31,
  27,
  19,
  3,
  6,
  12,
  24,
  21,
  15,
  30,
  25,
  23,
  11,
  22,
  9,
  18,
  1,
]
const glog: number[] = [
  0,
  0,
  1,
  18,
  2,
  5,
  19,
  11,
  3,
  29,
  6,
  27,
  20,
  8,
  12,
  23,
  4,
  10,
  30,
  17,
  7,
  22,
  28,
  26,
  21,
  25,
  9,
  16,
  13,
  14,
  24,
  15,
]
const cwmap: number[] = [3, 2, 1, 0, 7, 6, 5, 4, 13, 14, 15, 16, 12, 8, 9, 10, 11]
const alphabet: string[] = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.split('')
const base32Length = 13

const ginv = (a: any): number => {
  return gexp[31 - glog[a]]
}

const gmult = (a: any, b: any): number => {
  if (a === 0 || b === 0) {
    return 0
  }

  const idx = (glog[a] + glog[b]) % 31

  return gexp[idx]
}

/**
 * Encode an arbitrary string into Reed Solomon encoded string <PREFIX>-XXXX-XXXX-XXXX-XXXXX
 * @param prefix The prefix for the encoded string
 * @param digest An arbitrary string
 * @return the address in Reed-Solomon encoding, or
 * throws an exception if digest is invalid
 */
export const encodeReedSolomon = (prefix: string, digest: string): string => {
  if (digest === undefined || digest === null || digest.trim().length === 0) {
    throw Error('Invalid input')
  }

  const plainString10 = [],
    codeword = initialCodeword.slice()
  let pos = 0

  let length = digest.length

  for (let i = 0; i < length; i++) {
    plainString10[i] = digest.charCodeAt(i) - '0'.charCodeAt(0)
  }

  let digit32 = 0,
    newLength = 0
  do {
    digit32 = 0
    newLength = 0
    for (let i = 0; i < length; i++) {
      digit32 = digit32 * 10 + plainString10[i]
      if (digit32 >= 32) {
        plainString10[newLength] = digit32 >> 5
        digit32 &= 31
        newLength++
      } else if (newLength > 0) {
        plainString10[newLength] = 0
        newLength++
      }
    }

    length = newLength
    codeword[pos] = digit32
    pos++
  } while (length > 0)

  const p = [0, 0, 0, 0]

  for (let i = base32Length - 1; i >= 0; i--) {
    const fb = codeword[i] ^ p[3]

    p[3] = p[2] ^ gmult(30, fb)
    p[2] = p[1] ^ gmult(6, fb)
    p[1] = p[0] ^ gmult(9, fb)
    p[0] = gmult(17, fb)
  }

  codeword[13] = p[0]
  codeword[14] = p[1]
  codeword[15] = p[2]
  codeword[16] = p[3]

  let out = prefix.toUpperCase() + '-'

  for (let i = 0; i < 17; i++) {
    out += alphabet[codeword[cwmap[i]]]

    if ((i & 3) === 3 && i < 13) {
      out += '-'
    }
  }

  return out
}
