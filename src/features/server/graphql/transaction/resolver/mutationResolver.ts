import { logger } from '../../../../@common/logger'
import { provideTransactionService } from '../../../../storage/utils'

export const mutationResolver = {
  // airdropPoints: (parent: any, { args }: any): Promise<any> => {
  //   logger.debug(`Airdrop ${JSON.stringify(args)}`)
  //   return provideTransactionService().airdrop(args)
  // },
}
