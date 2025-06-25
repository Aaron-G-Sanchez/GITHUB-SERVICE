import {
  expect,
  test,
  describe,
  mock,
  afterEach,
  beforeAll,
  afterAll
} from 'bun:test'

import { fetchUtil } from '../../../src/services/utils/github.util'

const ORIGINAL_FETCH = global.fetch

const TEST_ENDPOINT = 'https://api.example.test'

const TEST_HEADERS: Record<string, string> = {
  'User-Agent': 'test-agent',
  'X-GitHub-Api-Version': '1.0',
  Authorization: 'Bearer test-token'
}

const TEST_RESPONSE_DATA = {
  ok: true,
  json: () =>
    Promise.resolve({
      msg: 'Mocked Data'
    }),
  status: 200
} as Response

const MOCK_FETCH = mock(() => Promise.resolve(TEST_RESPONSE_DATA))

describe('fetchUtil', async () => {
  beforeAll(() => {
    mock.restore()
    console.log('hello from beforeEach.')
  })

  afterAll(() => {
    global.fetch = ORIGINAL_FETCH
  })

  global.fetch = MOCK_FETCH as unknown as typeof fetch

  const result = await fetchUtil(TEST_ENDPOINT, { headers: TEST_HEADERS })

  test('should be called with proper data', () => {
    expect(MOCK_FETCH).toHaveBeenCalledTimes(1)
    expect(MOCK_FETCH.mock.calls[0]).toContain(TEST_ENDPOINT)
  })

  test('should return a Response object', async () => {
    expect(result).toMatchObject(TEST_RESPONSE_DATA as Response)
  })
})
