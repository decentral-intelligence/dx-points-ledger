import { config } from '../../../../config'
import { AccountRole } from '../../../storage/types/AccountRole'
import { NotAllowedError } from '../../../../types/exceptions/NotAllowedError'

export function verifyPermission(role: AccountRole, key: string) {
  console.log('key: ', config.get('api.key'))

  if (role === AccountRole.Admin && key !== config.get('api.key')) {
    throw new NotAllowedError('Method not permitted')
  }
}
