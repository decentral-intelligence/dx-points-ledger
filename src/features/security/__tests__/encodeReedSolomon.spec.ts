import { encodeReedSolomon } from '../encodeReedSolomon'
import { createHash } from 'crypto'

describe('encodeReedSolomon', () => {
  it('should encode an arbitrary string as expected', () => {
    const hash = createHash('sha256')
    hash.update('Some data to be hashed')
    const digest = hash.digest('hex')
    const encoded = encodeReedSolomon('XPOINTS', digest)
    expect(encoded).toBe('XPOINTS-HZ84-7QGS-SN9D-VYSRV')
  })
  it('should return undefined if input is empty', () => {
    expect(() => encodeReedSolomon('XPOINTS', '')).toThrow()
  })
})
