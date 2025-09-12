import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  spyOn,
  mock
} from 'bun:test'
import { MongoMemoryServer } from 'mongodb-memory-server'

import * as db from '@database/db'
import * as syncUtils from '@jobs/sync/utils/sync.util'
import * as util from '@jobs-utils/util.shared'
import { MOCK_DB_CONNECTION } from '@test_utils/db.mock'
import { Repository } from '@models/Repository'
import { SyncDatabase } from '@jobs/sync/sync.job'
import { MongoClient } from 'mongodb'
import { AppConfig } from '@config/config.config'

const TEST_CONFIG = new AppConfig()

const MOCK_INITIAL_SAVED_REPOS: Repository[] = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 0,
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
    open_issues_count: 0,
    has_issues: true,
    created_at: '2025-06-28T10:15:40Z'
  }
]

const MOCK_NEWLY_UPDATED_REPOS: Repository[] = [
  {
    gh_id: 123456,
    name: 'Test-Repo',
    full_name: 'user/Test-Repo',
    html_url: 'http://example.com/user/Test-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/Test-Repo',
    open_issues_count: 0,
    has_issues: true,
    created_at: '2025-06-26T23:05:15Z'
  },
  {
    gh_id: 9999,
    name: 'New-Repo',
    full_name: 'user/New-Repo',
    html_url: 'http://example.com/user/New-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/New-Repo',
    open_issues_count: 1,
    has_issues: true,
    created_at: '2025-07-01T07:35:03Z'
  }
]

const MOCK_FETCH_ISSUES_RESPONSE: Repository[] = [
  {
    gh_id: 9999,
    name: 'New-Repo',
    full_name: 'user/New-Repo',
    html_url: 'http://example.com/user/New-Repo',
    fork: false,
    url: 'http://api.example.com/repos/user/New-Repo',
    open_issues_count: 1,
    has_issues: true,
    created_at: '2025-07-01T07:35:03Z',
    issues: [
      {
        gh_id: 111,
        number: 1,
        title: 'Test Issue One',
        state: 'open',
        body: 'this is the body',
        repository_url: 'http://example.com/user/New-Repo'
      }
    ]
  }
]

const EXPECTED_REPOS: Repository[] = [
  ...MOCK_INITIAL_SAVED_REPOS,
  ...MOCK_FETCH_ISSUES_RESPONSE
]

// Mock functions to stub.
const DB_CONNECTION_SPY = spyOn(db, 'connect')
const FETCH_USER_REPOS_SPY = spyOn(util, 'FetchUserRepos')
const FETCH_ISSUES_SPY = spyOn(util, 'FetchIssues')

// Mock functions to spy on.
const GET_ALL_REPO_IDS_SPY = spyOn(syncUtils, 'GetAllRepoIds')
const GET_LAST_ENTRY_SPY = spyOn(syncUtils, 'GetLastEntry')
const FILTER_NEW_REPOS_SPY = spyOn(syncUtils, 'FilterNewRepos')
const FILTER_REPOS_WITH_ISSUES_SPY = spyOn(util, 'FilterReposWithIssues')
const MERGE_REPOS_SPY = spyOn(util, 'MergeRepos')

describe('Jobs test suite:', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()

    DB_CONNECTION_SPY.mockImplementation(() =>
      MOCK_DB_CONNECTION(mongoServer, MOCK_INITIAL_SAVED_REPOS)
    )

    FETCH_USER_REPOS_SPY.mockImplementation(() => {
      return Promise.resolve(MOCK_NEWLY_UPDATED_REPOS)
    })

    FETCH_ISSUES_SPY.mockImplementation(() => {
      return Promise.resolve(MOCK_FETCH_ISSUES_RESPONSE)
    })
  })

  afterAll(async () => {
    if (mongoServer) await mongoServer.stop()
    mock.restore()
  })

  describe('sync job', () => {
    let testClient: MongoClient

    beforeAll(async () => {
      testClient = await SyncDatabase(TEST_CONFIG)
    })

    afterAll(async () => {
      if (testClient) testClient.close()
    })

    test('should connect to database', () => {
      expect(DB_CONNECTION_SPY).toHaveBeenCalledTimes(1)
    })

    test('should query and return all repos in DB to create ID set', () => {
      expect(GET_ALL_REPO_IDS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should query the latest repository entry in DB', () => {
      expect(GET_LAST_ENTRY_SPY).toHaveBeenCalledTimes(1)
    })

    test('should fetch any repos updated after date of latest repository entry', () => {
      expect(FETCH_USER_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should filter out newly added repositories', () => {
      expect(FILTER_NEW_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should take new repos and isolate repos that have issues', () => {
      expect(FILTER_REPOS_WITH_ISSUES_SPY).toHaveBeenCalledTimes(1)
    })

    test('should fetch issues for new repos that have issues', () => {
      expect(FETCH_ISSUES_SPY).toHaveBeenCalledTimes(1)
    })

    test('should merge new repos with issues with new repos sans issues', () => {
      expect(MERGE_REPOS_SPY).toHaveBeenCalledTimes(1)
    })

    test('should save new repositories into the db', async () => {
      const GOT_REPOS = await db.collections.repositories?.find({}).toArray()

      expect(GOT_REPOS?.length).toBe(EXPECTED_REPOS.length)
      expect(GOT_REPOS).toEqual(
        expect.arrayContaining(
          EXPECTED_REPOS.map((repo) => expect.objectContaining(repo))
        )
      )
    })
  })
})
