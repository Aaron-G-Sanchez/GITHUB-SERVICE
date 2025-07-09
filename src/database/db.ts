import { Collection, MongoClient, ServerApiVersion } from 'mongodb'

import { Repository } from '../models/Repository'
import { config } from '../config/config.config'

export const collections: { repositories?: Collection<Repository> } = {}

// TODO: Add environment based DB connection.
export const connect = async (): Promise<MongoClient | Error> => {
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
