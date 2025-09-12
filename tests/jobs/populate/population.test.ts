import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  spyOn,
  mock
} from 'bun:test'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

import * as db from '@database/db'
import * as util from '@jobs/shared/util.shared'
import { PopulateDatabase } from '@jobs/populate/population.job'
import { Repository } from '@models/Repository'
import { MOCK_DB_CONNECTION } from '@test_utils/db.mock'
import { AppConfig } from '@config/config.config'

const TEST_CONFIG = new AppConfig()

const MOCK_FETCH_USER_REPOS_RESPONSE: Repository[] = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 2,
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
    open_issues_count: 1,
    has_issues: true,
    created_at: '2025-06-28T10:15:40Z'
  }
]

const MOCK_FETCH_ISSUES_RESPONSE: Repository[] = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 2,
    has_issues: true,
    created_at: '2025-06-26T23:05:15Z',
    issues: [
      {
        gh_id: 1111,
        number: 1,
        title: 'Test Issue One',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Test-Repo'
      },
      {
        gh_id: 2222,
        number: 2,
        title: 'Test Issue Two',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Test-Repo'
      }
    ]
  },
  {
    gh_id: 987654,
    name: 'Third-Repo',
    full_name: 'user/Third-Repo',
    html_url: 'http://example.com/user/Third-Repo',
    fork: true,
    url: 'http://api.example.com/repos/user/Third-Repo',
    open_issues_count: 1,
    has_issues: true,
    created_at: '2025-06-28T10:15:40Z',
    issues: [
      {
        gh_id: 3333,
        number: 1,
        title: 'Test Issue Three',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Third-Repo'
      }
    ]
  }
]

const MERGED_REPOS: Repository[] = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 2,
    has_issues: true,
    created_at: '2025-06-26T23:05:15Z',
    issues: [
      {
        gh_id: 1111,
        number: 1,
        title: 'Test Issue One',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Test-Repo'
      },
      {
        gh_id: 2222,
        number: 2,
        title: 'Test Issue Two',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Test-Repo'
      }
    ]
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
    open_issues_count: 1,
    has_issues: true,
    created_at: '2025-06-28T10:15:40Z',
    issues: [
      {
        gh_id: 3333,
        number: 1,
        title: 'Test Issue Three',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Third-Repo'
      }
    ]
  }
]

const DB_CONNECTION_SPY = spyOn(db, 'connect')
const FETCH_USER_REPOS_SPY = spyOn(util, 'FetchUserRepos')
const FETCH_ISSUES_SPY = spyOn(util, 'FetchIssues')

const FILTER_REPOS_SPY = spyOn(util, 'FilterReposWithIssues')
const MERGE_REPOS_SPY = spyOn(util, 'MergeRepos')

describe('Jobs test suite:', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()

    DB_CONNECTION_SPY.mockImplementation(() => MOCK_DB_CONNECTION(mongoServer))

    FETCH_USER_REPOS_SPY.mockImplementation(() => {
      return Promise.resolve(MOCK_FETCH_USER_REPOS_RESPONSE)
    })

    FETCH_ISSUES_SPY.mockImplementation(() => {
      return Promise.resolve(MOCK_FETCH_ISSUES_RESPONSE)
    })
  })

  afterAll(async () => {
    if (mongoServer) await mongoServer.stop()
    mock.restore()
  })

  describe('population job', () => {
    let testClient: MongoClient

    beforeAll(async () => {
      testClient = await PopulateDatabase(TEST_CONFIG)
    })

    afterAll(async () => {
      if (testClient) testClient.close()
    })

    test('should connect and fetch user repositories', async () => {
      expect(DB_CONNECTION_SPY).toHaveBeenCalledTimes(1)
      expect(FETCH_USER_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should call util functions to process data', () => {
      expect(FILTER_REPOS_SPY).toHaveBeenCalledTimes(1)
      expect(MERGE_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should save repositories to the collection', async () => {
      const testRepos = await db.collections.repositories?.find({}).toArray()

      expect(testRepos?.length).toBe(MERGED_REPOS.length)

      expect(testRepos).toEqual(
        expect.arrayContaining(
          MERGED_REPOS.map((repo) => expect.objectContaining(repo))
        )
      )
    })
  })
})
