import PQueue from 'p-queue'
import { logger } from '../../@common/logger'

export class OperationsQueue {
  private _pqueue = new PQueue({ concurrency: 1 })
  private _finishRequested = false

  public enqueue(operation: () => Promise<unknown>, processingDelay: number): void {
    if (!this._finishRequested) {
      this._pqueue.add(operation)
    }
  }

  public async finish(): Promise<void> {
    this._finishRequested = true
    const pendingOps = this._pqueue.size / 2
    if (pendingOps) {
      logger.info(`Waiting for ${pendingOps} pending operations...`)
    }
    return this._pqueue.onIdle()
  }
}
