import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

import { Repository } from '../models/Repository'

dotenv.config()

const MONGO_DB_URI = process.env.MONGO_DB_URI

if (!MONGO_DB_URI) throw new Error('No MONGO_DB_URI found.')

export const collections: { repositories?: Collection<Repository> } = {}

export const connect = async (): Promise<MongoClient> => {
  const client = new MongoClient(MONGO_DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  await client.connect()

  const db = client.db()

  const repositoriesCollection = db.collection<Repository>('repositories')

  collections.repositories = repositoriesCollection

  console.log(`Successfully connected to database: ${db.databaseName}`)

  return client
}
