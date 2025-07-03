import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

import * as db from '../../src/database/db'
import * as util from '../../src/services/utils/github.util'
import { PopulateDatabase } from '../../src/services/population.service'
import { Repository } from '../../src/models/Repository'

const MOCK_FETCH_USERS_RESPONSE = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 8,
    has_issues: true,
    created_at: '2025-06-26T23:05:15Z'
  },
  {
    gh_id: 789123,
    name: 'Second-Repo',
    full_name: 'user/Second-Repo',
    html_url: 'http://example.com/user/Second-Repo',
    fork: true,
    url: 'http://api.example.com/repos/user/Second-Repo',
    open_issues_count: 0,
    has_issues: true,
    created_at: '2025-06-27T23:05:15Z'
  },
  {
    gh_id: 987654,
    name: 'Third-Repo',
    full_name: 'user/Third-Repo',
    html_url: 'http://example.com/user/Third-Repo',
    fork: true,
    url: 'http://api.example.com/repos/user/Third-Repo',
    open_issues_count: 12,
    has_issues: true,
    created_at: '2025-06-28T10:15:40Z'
  }
]

const DB_CONNECTION_SPY = spyOn(db, 'connect')
const FETCH_USER_REPOS_SPY = spyOn(util, 'FetchUserRepos')
const FILTER_REPOS_SPY = spyOn(util, 'FilterReposWithIssues')

describe('services test suite:', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()

    DB_CONNECTION_SPY.mockImplementation(() => MOCK_DB_CONNECTION(mongoServer))

    FETCH_USER_REPOS_SPY.mockImplementation(() => {
      return Promise.resolve(MOCK_FETCH_USERS_RESPONSE)
    })
  })

  afterAll(async () => {
    if (mongoServer) await mongoServer.stop()
    FETCH_USER_REPOS_SPY.mockRestore()
  })

  describe('db population', () => {
    let testClient: MongoClient

    beforeAll(async () => {
      testClient = await PopulateDatabase()
    })

    afterAll(async () => {
      if (testClient) testClient.close()
    })

    test('should connect and fetch user repositories', async () => {
      expect(DB_CONNECTION_SPY).toHaveBeenCalledTimes(1)
      expect(FILTER_REPOS_SPY).toHaveBeenCalledTimes(1)
      expect(FETCH_USER_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should save repositories to the collection', async () => {
      const testRepos = await db.collections.repositories?.find({}).toArray()

      expect(testRepos?.length).toBe(MOCK_FETCH_USERS_RESPONSE.length)

      expect(testRepos).toEqual(
        expect.arrayContaining(MOCK_FETCH_USERS_RESPONSE)
      )
    })
  })
})

async function MOCK_DB_CONNECTION(
  server: MongoMemoryServer
): Promise<MongoClient> {
  const testClient = await MongoClient.connect(server.getUri())

  const testDatabase = testClient.db()

  const testRepositoriesCollection =
    testDatabase.collection<Repository>('repositories')

  db.collections.repositories = testRepositoriesCollection

  return Promise.resolve(testClient)
}
