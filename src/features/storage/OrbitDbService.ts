// @ts-ignore
import IpfsClient from 'ipfs-http-client'
// @ts-ignore
import OrbitDB from 'orbit-db'
import { logger } from '../@common/logger'

export class OrbitDbService {
  private orbitdb: any = null
  private transactions: any = null
  private accounts: any = null

  constructor(private ipfs: any = IpfsClient()) {}

  async start() {
    logger.info('Connecting to IPFS daemon')
    this.ipfs = IpfsClient()
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(this.ipfs)
    this.transactions = await this.orbitdb.log('xpoints:transactions')
    logger.info(`Orbit Database instantiated ${JSON.stringify(this.orbitdb.identity.id)}`)
  }

  async stop() {
    logger.info('Stopping OrbitDB')
    if (this.orbitdb) {
      await this.orbitdb.stop()
    }
  }
}
