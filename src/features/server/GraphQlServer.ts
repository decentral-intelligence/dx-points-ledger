import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { resolvers, typeDefs } from './graphql'
import { logger } from '../@common/logger'
import { provideAccountService, provideTransactionService } from '../storage/utils'
import { config } from '../../config'

const isDevelopment = process.env.NODE_ENV !== 'production'

const DefaultConfig = {
  playground: isDevelopment,
  introspection: true,
  tracing: isDevelopment,
  debug: isDevelopment,
}

export class GraphQlServer {
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
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    })
    const port = config.get('api.port')
    const host = config.get('api.host')
    const { url } = await this.server.listen({ port, host })
    logger.info(`Apollo running on ${url}`)
  }

  public async stop(): Promise<void> {
    logger.info(`Stopping Apollo Server...`)
    await this.server?.stop()
    return Promise.resolve()
  }
}
