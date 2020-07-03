import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from './graphql'
import { logger } from '../@common/logger'
import { provideAccountService, provideTransactionService } from '../storage/utils'

const isDevelopment = process.env.NODE_ENV !== 'production'

const DefaultConfig = {
  playground: true,
  introspection: true,
  tracing: isDevelopment,
  debug: isDevelopment,
}

export class Server {
  private server: ApolloServer | undefined

  public async start(): Promise<void> {
    logger.info(`Starting Apollo Server...`)
    this.server = new ApolloServer({
      ...DefaultConfig,
      resolvers,
      typeDefs,
      dataSources: () => ({
        accounts: provideAccountService(),
        transactions: provideTransactionService(),
      }),
    })
    const { url } = await this.server.listen({ port: 3001 })
    logger.info(`Apollo running on ${url}`)
  }

  public async stop(): Promise<void> {
    logger.info(`Stopping Apollo Server...`)
    await this.server?.stop()
  }
}
