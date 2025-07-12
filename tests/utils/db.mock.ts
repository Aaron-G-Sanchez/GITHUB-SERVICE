import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

import { Repository } from '@models/Repository'
import * as db from '@database/db'

export async function MOCK_DB_CONNECTION(
  server: MongoMemoryServer,
  seedData?: Repository[]
): Promise<MongoClient> {
  const testClient = await MongoClient.connect(server.getUri())

  const testDatabase = testClient.db()

  const testRepositoriesCollection =
    testDatabase.collection<Repository>('repositories')

  db.collections.repositories = testRepositoriesCollection

  if (seedData) {
    await db.collections.repositories.insertMany(seedData)
  }

  return Promise.resolve(testClient)
}
