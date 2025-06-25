import { expect, test, describe, mock, beforeEach, afterEach } from 'bun:test'

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

beforeEach(() => {
  mock.restore()
})

afterEach(() => {
  global.fetch = ORIGINAL_FETCH
})

describe('fetchUtil', () => {
  global.fetch = MOCK_FETCH as unknown as typeof fetch

  test('should call fetch api and return proper data', async () => {
    const result = await fetchUtil(TEST_ENDPOINT, { headers: TEST_HEADERS })

    expect(result).toMatchObject(TEST_RESPONSE_DATA as Response)
    expect(MOCK_FETCH).toHaveBeenCalledTimes(1)
    expect(MOCK_FETCH.mock.calls[0]).toContain(TEST_ENDPOINT)
  })

  // TODO: Write out individual tests for what should be done within the
})
