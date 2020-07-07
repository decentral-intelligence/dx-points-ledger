import { logger } from '../@common/logger'
// @ts-ignore
import * as Ipfs from 'ipfs'

export class IpfsService {
  get ipfsNode(): any {
    return this._ipfs
  }

  private _ipfs: any

  public async start(config: object) {
    logger.info('Booting IPFS...')
    logger.debug(JSON.stringify(config))
    this._ipfs = await Ipfs.create(config)
    const id = await this._ipfs.id()
    logger.info(`Ipfs started - Id: ${id}`)
  }
}
