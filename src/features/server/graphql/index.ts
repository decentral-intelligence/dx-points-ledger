import { join } from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'

const resolverFiles = loadFilesSync(join(__dirname, './**/*.resolver.*'))
const typeDefsFiles = loadFilesSync(join(__dirname, './**/*.graphql'))

export const typeDefs = mergeTypeDefs(typeDefsFiles)
export const resolvers = mergeResolvers(resolverFiles)
