import {
  expect,
  test,
  describe,
  mock,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach
} from 'bun:test'

import {
  fetchUtil,
  parseResponseData
} from '../../../src/services/utils/github.util'
import { Repository } from '../../../src/models/Repository'

const TEST_ENDPOINT = 'https://api.example.test'

const TEST_HEADERS: Record<string, string> = {
  'User-Agent': 'test-agent',
  'X-GitHub-Api-Version': '1.0',
  Authorization: 'Bearer test-token'
}

const TEST_RESPONSE_DATA = {
  ok: true,
  json: () =>
    Promise.resolve([
      {
        id: 123456,
        node_id: 'someHashOne',
        name: 'Test-Repo',
        full_name: 'user/Test-Repo',
        owner: {
          login: 'user',
          id: 1,
          node_id: 'someHashTwo'
        },
        private: false,
        html_url: 'http://example.com/user/Test-Repo',
        fork: false,
        url: 'http://api.example.com/repos/user/Test-Repo',
        open_issues_count: 8,
        has_pages: false,
        has_issues: true,
        created_at: '2025-06-26T23:05:15Z',
        watchers: 100
      },
      {
        id: 789123,
        node_id: 'someHashThree',
        name: 'Second-Repo',
        full_name: 'user/Second-Repo',
        owner: {
          login: 'user',
          id: 1,
          node_id: 'someHashFour'
        },
        private: false,
        html_url: 'http://example.com/user/Second-Repo',
        fork: true,
        url: 'http://api.example.com/repos/user/Second-Repo',
        open_issues_count: 3,
        has_issues: true,
        has_pages: false,
        created_at: '2025-06-27T23:05:15Z',
        watchers: 100
      }
    ]),
  status: 200
} as Response

const PARSED_REPO_ONE: Repository = {
  gh_id: 123456,
  name: 'Test-Repo',
  full_name: 'user/Test-Repo',
  html_url: 'http://example.com/user/Test-Repo',
  fork: false,
  url: 'http://api.example.com/repos/user/Test-Repo',
  open_issues_count: 8,
  has_issues: true,
  created_at: '2025-06-26T23:05:15Z'
}
const PARSED_REPO_TWO: Repository = {
  gh_id: 789123,
  name: 'Second-Repo',
  full_name: 'user/Second-Repo',
  html_url: 'http://example.com/user/Second-Repo',
  fork: true,
  url: 'http://api.example.com/repos/user/Second-Repo',
  open_issues_count: 3,
  has_issues: true,
  created_at: '2025-06-27T23:05:15Z'
}

const MOCK_FETCH = mock(() => Promise.resolve(TEST_RESPONSE_DATA))

describe('Util functions suite', () => {
  beforeAll(() => {
    global.fetch = MOCK_FETCH as unknown as typeof fetch
  })

  afterEach(() => {
    MOCK_FETCH.mockClear()
  })

  describe('fetchUtil', async () => {
    test('should be called with proper data', async () => {
      await fetchUtil(TEST_ENDPOINT, { headers: TEST_HEADERS })
      expect(MOCK_FETCH).toHaveBeenCalledTimes(1)
      expect(MOCK_FETCH.mock.calls[0]).toContain(TEST_ENDPOINT)

      console.log(MOCK_FETCH.mock.calls)
    })

    test('should return a Response object', async () => {
      const result = await fetchUtil(TEST_ENDPOINT, { headers: TEST_HEADERS })
      expect(result).toMatchObject(TEST_RESPONSE_DATA as Response)

      console.log(MOCK_FETCH.mock.calls)
    })
  })

  describe('parseResponseData', () => {
    test('should parse necessary data from API Response', async () => {
      const parsedRepos = await parseResponseData(TEST_RESPONSE_DATA)

      expect(parsedRepos).toEqual([PARSED_REPO_ONE, PARSED_REPO_TWO])
    })
  })

  describe('FetchUserRepos', async () => {
    // TODO: Implement tests.

    test('test', async () => {
      const result = await fetchUtil('pp.com')
      console.log(MOCK_FETCH.mock.calls) // Should be empty at this point
      expect(2).toBe(2)
    })
  })
})
