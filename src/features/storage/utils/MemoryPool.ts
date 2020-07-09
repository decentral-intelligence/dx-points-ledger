import { logger } from '../../@common/logger'
import { EventEmitter } from 'events'

export interface MemoryPoolOptions<T> {
  /**
   * Timeout in milliseconds until action is triggered
   * */
  timeout: number
  /**
   * The limit of hold items, until is triggered
   */
  limit: number
  /**
   * The action to be called, whether timeout or limit is reached
   */
  action: MemoryPoolAction<T>

  /**
   * If set a deduplication function, any added entry in pool will be compared to existing ones
   * and eventually discarded, if duplication is detected
   * @param entry One entry
   * @param otherEntry The other entry
   * @return If return true, the to-be-added entry will be discarded
   */
  dedupeFn?: (entry: T, otherEntry: T) => boolean
}

export type MemoryPoolAction<T> = (entry: Array<T>) => Promise<void>

/**
 * A class to hold back items from being processed until its limit (amount of entries) or
 * a certain time is reached
 */
export class MemoryPool<T> {
  get entries(): T[] {
    return this._entries
  }

  private _entries = new Array<T>()
  private timeoutHandler: NodeJS.Timeout | null = null
  private emitter = new EventEmitter()
  private isFinishing = false
  private options: MemoryPoolOptions<T> | null = null

  public get isInitialized(): boolean {
    return this.options !== null
  }

  public initialize(options: MemoryPoolOptions<T>) {
    if (this.options !== null) {
      throw new Error('Memory pool already initialized')
    }
    this.options = options
  }

  public addEntry(entry: T): void {
    if (this.options === null) {
      throw new Error('Memory pool not initialized yet')
    }

    if (this.isFinishing) {
      logger.warn('Memory pool is finishing. Entry ignored')
      return
    }

    if (this.timeoutHandler === null) {
      this.timeoutHandler = setTimeout(this.dispatch.bind(this), this.options.timeout)
    }

    if (this.options?.dedupeFn !== null) {
      const isDuplicated = this._entries.findIndex((e) => this.options?.dedupeFn?.(e, entry)) !== -1
      if (isDuplicated) {
        logger.debug(`Duplicated entry ignored: ${entry}`)
        return
      }
    }

    this._entries.push(entry)
    if (this._entries.length === this.options.limit) {
      this.dispatch()
    }
  }

  public dispatch(): void {
    if (this.options === null) {
      throw new Error('Memory pool not initialized yet')
    }

    if (this.timeoutHandler !== null) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = null
    }

    if (this._entries.length > 0) {
      this.options.action([...this._entries]).catch((e) => {
        logger.error(`Memory pool Action failed: ${e}`)
      })
      this.emitter.emit('dispatched')
      this._entries = []
    }
  }

  /**
   * Gracefully finishes the entry pool, i.e. eventually waits for pending entries
   * */
  public async finish(): Promise<void> {
    this.isFinishing = true
    const promise =
      this.timeoutHandler === null
        ? await Promise.resolve()
        : new Promise<void>((resolve) => {
            logger.info('Waiting for pending entries...')
            this.emitter.once('dispatched', resolve)
          })
    await promise
    this.options = null
  }
}
