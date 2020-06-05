// @ts-ignore
import IpfsClient from 'ipfs-http-client'
// @ts-ignore
import OrbitDB from 'orbit-db'
import { logger } from '../logger'

export class OrbitDbService {
  private orbitdb: any = null

  constructor(private ipfs: any) {}

  async start() {
    logger.info('Connecting to IPFS daemon')
    this.ipfs = IpfsClient()
    logger.info('Starting OrbitDb...')
    this.orbitdb = await OrbitDB.createInstance(this.ipfs)
    // TODO: define proper database type
    const db = await this.orbitdb.log('hellos')
    logger.info('Orbit Database instantiated', db.identity.toJSON())
  }

  async stop() {
    logger.info('Stopping OrbitDB')
    if (this.orbitdb) {
      await this.orbitdb.stop()
    }
  }
}

export const orbitDbService = new OrbitDbService(IpfsClient())
