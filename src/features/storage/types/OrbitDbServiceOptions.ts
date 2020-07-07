import { IpfsService } from '../IpfsService'

export interface OrbitDbServiceOptions {
  ipfsService: IpfsService
  transactionsDatabaseAddress: string
  accountsDatabaseAddress: string
}
