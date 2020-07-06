import { createHash } from 'crypto'

export const createEntityIdForUniques = (uniqueValue: string): string =>
  createHash('sha256').update(uniqueValue, 'utf8').digest('hex')
