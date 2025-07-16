import {
  expect,
  test,
  describe,
  mock,
  afterEach,
  spyOn,
  beforeEach
} from 'bun:test'

import * as utils from '@jobs-utils/util.shared'
import { Repository } from '@models/Repository'
import { Issue } from '@models/Issue'

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
          node_id: 'someHash'
        },
        private: false,
        html_url: 'http://example.com/user/Test-Repo',
        fork: false,
        url: 'http://api.example.com/repos/user/Test-Repo',
        open_issues_count: 0,
        has_pages: false,
        has_issues: true,
        created_at: '2025-06-26T23:05:15Z',
        watchers: 100
      },
      {
        id: 789123,
        node_id: 'someHashTwo',
        name: 'Second-Repo',
        full_name: 'user/Second-Repo',
        owner: {
          login: 'user',
          id: 1,
          node_id: 'someHash'
        },
        private: false,
        html_url: 'http://example.com/user/Second-Repo',
        fork: true,
        url: 'http://api.example.com/repos/user/Second-Repo',
        open_issues_count: 2,
        has_issues: true,
        has_pages: false,
        created_at: '2025-06-27T23:05:15Z',
        watchers: 100
      },
      {
        id: 987654,
        node_id: 'someHashThree',
        name: 'Third-Repo',
        full_name: 'user/Third-Repo',
        owner: {
          login: 'user',
          id: 1,
          node_id: 'someHash'
        },
        private: false,
        html_url: 'http://example.com/user/Third-Repo',
        fork: true,
        url: 'http://api.example.com/repos/user/Third-Repo',
        open_issues_count: 1,
        has_issues: true,
        has_pages: false,
        created_at: '2025-06-27T23:05:15Z',
        watchers: 100
      }
    ]),
  status: 200,
  headers: new Headers({
    link: '<http://api.example.com/user/repos>; rel="first"'
  })
} as Response

const TEST_ISSUES_RESPONSE_REPO_TWO = {
  ok: true,
  json: () =>
    Promise.resolve([
      {
        id: 1111,
        node_id: 'someHashOne',
        url: 'http://example.com/user/Second-Repo/issues/1',
        number: 1,
        title: 'Test Issue One',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Second-Repo',
        user: {
          login: 'user',
          id: 1
        }
      },
      {
        id: 2222,
        node_id: 'someHashTwo',
        url: 'http://example.com/user/Second-Repo/issues/2',
        number: 2,
        title: 'Test Issue Two',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Second-Repo',
        user: {
          login: 'user',
          id: 1
        }
      }
    ]),
  status: 200
} as Response

const TEST_ISSUES_RESPONSE_REPO_THREE = {
  ok: true,
  json: () =>
    Promise.resolve([
      {
        id: 3333,
        node_id: 'someHashThree',
        url: 'http://example.com/user/Third-Repo/issues/1',
        number: 1,
        title: 'Test Issue Three',
        state: 'open',
        body: 'This is the body',
        repository_url: 'http://example.com/user/Third-Repo',
        user: {
          login: 'user',
          id: 1
        }
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
  open_issues_count: 0,
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
  open_issues_count: 2,
  has_issues: true,
  created_at: '2025-06-27T23:05:15Z'
}
const PARSED_REPO_THREE: Repository = {
  gh_id: 987654,
  name: 'Third-Repo',
  full_name: 'user/Third-Repo',
  html_url: 'http://example.com/user/Third-Repo',
  fork: true,
  url: 'http://api.example.com/repos/user/Third-Repo',
  open_issues_count: 1,
  has_issues: true,
  created_at: '2025-06-27T23:05:15Z'
}

const PARSED_ISSUE_ONE: Issue = {
  gh_id: 1111,
  number: 1,
  title: 'Test Issue One',
  state: 'open',
  body: 'This is the body',
  repository_url: 'http://example.com/user/Second-Repo'
}
const PARSED_ISSUES_TWO: Issue = {
  gh_id: 2222,
  number: 2,
  title: 'Test Issue Two',
  state: 'open',
  body: 'This is the body',
  repository_url: 'http://example.com/user/Second-Repo'
}
const PARSED_ISSUE_THREE: Issue = {
  gh_id: 3333,
  number: 1,
  title: 'Test Issue Three',
  state: 'open',
  body: 'This is the body',
  repository_url: 'http://example.com/user/Third-Repo'
}

const REPO_TWO_ISSUES = [PARSED_ISSUE_ONE, PARSED_ISSUES_TWO]
const REPO_THREE_ISSUES = [PARSED_ISSUE_THREE]

const EXPECTED_REPO_TWO = {
  ...PARSED_REPO_TWO,
  issues: REPO_TWO_ISSUES
}
const EXPECTED_REPO_THREE = {
  ...PARSED_REPO_THREE,
  issues: REPO_THREE_ISSUES
}

const MOCK_FETCH_REPOSITORIES = mock(() => Promise.resolve(TEST_RESPONSE_DATA))

const MOCK_FETCH_ISSUES = mock((url: string) => {
  if (url.includes('Second-Repo')) {
    return Promise.resolve(TEST_ISSUES_RESPONSE_REPO_TWO)
  } else {
    return Promise.resolve(TEST_ISSUES_RESPONSE_REPO_THREE)
  }
})

const FETCH_UTIL_SPY = spyOn(utils, 'fetchUtil')
const PARSE_RESPONSE_DATA_SPY = spyOn(utils, 'parseResponseData')
const PARSE_ISSUES_SPY = spyOn(utils, 'parseIssues')

describe('Jobs test suite:', () => {
  describe('shared utils', () => {
    beforeEach(() => {
      global.fetch = MOCK_FETCH_REPOSITORIES as unknown as typeof fetch
    })

    afterEach(() => {
      MOCK_FETCH_REPOSITORIES.mockClear()
      FETCH_UTIL_SPY.mockClear()
      PARSE_RESPONSE_DATA_SPY.mockClear()
      PARSE_ISSUES_SPY.mockClear()
    })
    describe('fetchUtil', async () => {
      // TODO: Add tests for when the fetch is used for fetching Issues or Repos.
      test('should be called with proper data', async () => {
        await utils.fetchUtil(TEST_ENDPOINT, { headers: TEST_HEADERS })
        expect(MOCK_FETCH_REPOSITORIES).toHaveBeenCalledTimes(1)
        expect(MOCK_FETCH_REPOSITORIES.mock.calls[0]).toContain(TEST_ENDPOINT)
      })

      test('should return a Response object', async () => {
        const result = await utils.fetchUtil(TEST_ENDPOINT, {
          headers: TEST_HEADERS
        })
        expect(result).toMatchObject(TEST_RESPONSE_DATA as Response)
      })
    })

    describe('parseResponseData', () => {
      test('should parse necessary data from API Response', async () => {
        const parsedRepos = await utils.parseResponseData(TEST_RESPONSE_DATA)

        expect(parsedRepos).toEqual([
          PARSED_REPO_ONE,
          PARSED_REPO_TWO,
          PARSED_REPO_THREE
        ])
      })
    })

    // TODO: Implement a test that validates the pagination logic.
    describe('FetchUserRepos', async () => {
      describe('when only one page of repositories is returned', () => {
        test('should return a list of Repositories', async () => {
          const response = await utils.FetchUserRepos(TEST_ENDPOINT, {
            headers: TEST_HEADERS
          })

          expect(response).toEqual([
            PARSED_REPO_ONE,
            PARSED_REPO_TWO,
            PARSED_REPO_THREE
          ])
        })

        test('should call the [fetchUtil] function', async () => {
          await utils.FetchUserRepos(TEST_ENDPOINT, { headers: TEST_HEADERS })
          expect(FETCH_UTIL_SPY).toBeCalledTimes(1)
        })

        test('should call the [parseResponseData] function', async () => {
          await utils.FetchUserRepos(TEST_ENDPOINT, { headers: TEST_HEADERS })
          expect(PARSE_RESPONSE_DATA_SPY).toBeCalledTimes(1)
        })
      })
    })

    describe('FilterReposWithIssues', () => {
      test('should return repos that have active issues', () => {
        const result = utils.FilterReposWithIssues([
          PARSED_REPO_ONE,
          PARSED_REPO_TWO,
          PARSED_REPO_THREE
        ])

        expect(result).toEqual(
          expect.arrayContaining([PARSED_REPO_TWO, PARSED_REPO_THREE])
        )
      })
    })

    describe('FetchIssues', () => {
      const repoList = [PARSED_REPO_TWO, PARSED_REPO_THREE]

      beforeEach(() => {
        global.fetch = MOCK_FETCH_ISSUES as unknown as typeof fetch
      })

      test('should return a list of repositories with their issues', async () => {
        const response = await utils.FetchIssues(repoList, {
          headers: TEST_HEADERS
        })

        expect(Array.isArray(response)).toBeTrue()
        expect(response).toEqual([EXPECTED_REPO_TWO, EXPECTED_REPO_THREE])
      })

      test('should call [fetchUtil] function', async () => {
        await utils.FetchIssues(repoList, { headers: TEST_HEADERS })

        expect(FETCH_UTIL_SPY).toHaveBeenCalledTimes(2)
      })

      test('should call [parseIssues]', async () => {
        await utils.FetchIssues(repoList, { headers: TEST_HEADERS })

        expect(PARSE_ISSUES_SPY).toHaveBeenCalledTimes(2)
      })
    })
  })
})
