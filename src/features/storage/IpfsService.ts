import { logger } from '../@common/logger'
import * as Ipfs from 'ipfs'

export class IpfsService {
  get ipfsNode(): any {
    return this._ipfs
  }

  private _ipfs: any

  public async start(config: any): Promise<void> {
    const ipfsConfig = {
      ...config,
    }

    logger.info('Booting IPFS...')
    logger.debug(JSON.stringify(ipfsConfig))
    // @ts-ignore
    this._ipfs = await Ipfs.create(ipfsConfig)
    const identity = await this._ipfs.id()
    logger.info(`IPFS started - Id: ${identity.id}`)
  }

  public async stop(): Promise<void> {
    logger.info('Stopping IPFS Node...')
    await this._ipfs.stop()
  }
}
