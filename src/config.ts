import convict from 'convict'
import { join } from 'path'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  db: {
    transactions: {
      doc: 'Database address for transactions',
      format: String,
      default: 'xpoints:transactions',
      env: 'DB_TRANSACTIONS',
      arg: 'db-transactions',
    },
    accounts: {
      doc: 'Database name',
      format: String,
      default: 'xpoints:accounts',
      env: 'DB_ACCOUNTS',
      arg: 'db-accounts',
    },
  },
})

const env = config.get('env')
config.loadFile(join(__dirname, './config/' + env + '.json'))
config.validate({ allowed: 'strict' })

export { config }
