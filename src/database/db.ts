import { Collection, MongoClient, ServerApiVersion } from 'mongodb'

import { Repository } from '@models/Repository'
import { AppConfig } from '@config/config.config'

export const collections: { repositories?: Collection<Repository> } = {}

/**
 * Connects to a MongoDB database using the provided configuration options.
 *
 * @param [config] - The applications configuration
 *
 */
// TODO: Capitalize function name.
export const connect = async (
  config: AppConfig
): Promise<MongoClient | Error> => {
  const MONGO_DB_URI = config.dbConnectionString

  if (!MONGO_DB_URI) return new Error('No MONGO_DB_URI found.')

  const client = new MongoClient(MONGO_DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  await client.connect()

  // TODO: Add DB name.
  const db = client.db()

  const repositoriesCollection = db.collection<Repository>('repositories')

  collections.repositories = repositoriesCollection

  console.log(`Successfully connected to database: ${db.databaseName}`)

  return client
}
