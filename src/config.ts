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
  ipfs: {
    repo: {
      format: String,
      default: null,
    },
    silent: {
      format: Boolean,
      default: true,
    },
    config: {
      Addresses: {
        Swarm: {
          format: Array,
          default: ['/ip4/0.0.0.0/tcp/4011', '/ip4/0.0.0.0/tcp/4012/ws'],
        },
      },
      Bootstrap: {
        format: Array,
        default: [],
      },
    },
  },
  verifySignatures: {
    doc: 'Determine if signatures are verified. Do not disable in production!',
    format: Boolean,
    env: 'VERIFY_SIGNATURES',
    arg: 'verify-signatures',
    default: true,
  },
  transactionPool: {
    limit: {
      doc: 'Amount of transactions kept in memory before persisted',
      format: Number,
      env: 'POOL_LIMIT',
      arg: 'pool-limit',
      default: 20,
    },
    timeout: {
      doc: 'Duration in milliseconds for transactions kept in memory before persisted',
      format: Number,
      env: 'POOL_TIMEOUT',
      arg: 'pool-timeout',
      default: 5000,
    },
  },
})

const env = config.get('env')
config.loadFile(join(__dirname, './config/' + env + '.json'))
config.validate({ allowed: 'strict' })

export { config }
