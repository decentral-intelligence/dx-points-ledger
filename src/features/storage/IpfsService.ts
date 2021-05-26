import { logger } from '../@common/logger'
import * as Ipfs from 'ipfs'

export class IpfsService {
  get ipfsNode(): any {
    return this._ipfs
  }

  private _ipfs: any

  public async start(config: unknown): Promise<void> {
    logger.info('Booting IPFS...')
    logger.debug(JSON.stringify(config))
    // @ts-ignore
    this._ipfs = await Ipfs.create(config)
    const identity = await this._ipfs.id()
    logger.info(`IPFS started - Id: ${identity.id}`)
  }

  public async stop(): Promise<void> {
    logger.info('Stopping IPFS Node...')
    await this._ipfs.stop()
  }
}
