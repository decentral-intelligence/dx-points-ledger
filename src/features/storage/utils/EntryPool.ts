import { logger } from '../../@common/logger'
import { EventEmitter } from 'events'

export interface MempoolOptions<T> {
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
  action: MempoolAction<T>
}

export type MempoolAction<T> = (entry: Array<T>) => Promise<void>

/**
 * A class to hold back items from being processed until its limit (amount of entries) or
 * a certain time is reached
 */
export class EntryPool<T> {
  get entries(): T[] {
    return this._entries
  }

  private _entries = new Array<T>()
  private timeoutHandler: NodeJS.Timeout | null = null
  private emitter = new EventEmitter()
  private hasFinished = false

  constructor(private options: MempoolOptions<T>) {}

  private eventuallyStartTimeout(): void {
    if (this.timeoutHandler === null) {
      this.timeoutHandler = setTimeout(this.onDispatch.bind(this), this.options.timeout)
    }
  }

  public addEntry(entry: T): void {
    if (this.hasFinished) {
      logger.warn('Mempool is closing. Entry ignored')
      return
    }

    this.eventuallyStartTimeout()

    this._entries.push(entry)
    if (this._entries.length === this.options.limit) {
      this.onDispatch()
    }
  }

  public onDispatch(): void {
    if (this.timeoutHandler !== null) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = null
    }

    if (this._entries.length > 0) {
      this.options.action([...this._entries])
      this._entries = []
      this.emitter.emit('dispatched')
    }
  }

  /**
   * Waits until last items were dispatched
   * */
  public finish(): Promise<void> {
    this.hasFinished = true
    return new Promise<void>((resolve) => {
      this.emitter.once('dispatched', resolve)
    })
  }
}
