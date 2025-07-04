import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

import { Repository } from '../models/Repository'

dotenv.config()

export const collections: { repositories?: Collection<Repository> } = {}

// TODO: Add environment based DB connection.
export const connect = async (): Promise<MongoClient | Error> => {
  const MONGO_DB_URI = process.env.MONGO_DB_URI

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
