import { EntryPool } from '../EntryPool'
import { Seconds } from '../constants'

describe('EntryPool', () => {
  it('should trigger before timeout due to sufficient entries', () => {
    const callback = (_: number[]): Promise<void> => Promise.resolve()

    const action = jest.fn(callback)

    const pool = new EntryPool<number>({
      timeout: 5 * Seconds,
      limit: 5,
      action,
    })

    const items = [1, 2, 3, 4, 5, 6]
    items.forEach((n) => pool.addEntry(n))

    expect(action).toBeCalledWith([1, 2, 3, 4, 5])
    expect(pool.entries).toEqual([6])
  })

  it('should trigger after timeout', async () => {
    const callback = (_: number[]): Promise<void> => Promise.resolve()

    const action = jest.fn(callback)

    const pool = new EntryPool<number>({
      timeout: 2 * Seconds,
      limit: 5,
      action,
    })

    const items = [1, 2, 3, 4]
    items.forEach((n) => pool.addEntry(n))

    await pool.finish()

    expect(action).toBeCalledWith([1, 2, 3, 4])
    expect(pool.entries).toHaveLength(0)
  })

  it('cannot add more entries, once finish is called', () => {
    const callback = (_: number[]): Promise<void> => Promise.resolve()

    const action = jest.fn(callback)

    const pool = new EntryPool<number>({
      timeout: 2 * Seconds,
      limit: 5,
      action,
    })

    const items = [1, 2]
    items.forEach((n) => pool.addEntry(n))
    pool.finish()
    pool.addEntry(3)
    expect(pool.entries).toEqual([1, 2])
  })
})
