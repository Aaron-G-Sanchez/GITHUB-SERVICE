import { describe, test, expect, beforeEach } from 'bun:test'
import { Collection, WithId } from 'mongodb'

import { collections } from '@database/db'
import {
  FilterNewRepos,
  GetAllRepoIds,
  GetLastEntry
} from '@jobs/sync/utils/sync.util'
import { Repository } from '@models/Repository'

const MOCK_REPOS = [
  { gh_id: 3, name: 'repo 3', created_at: '2024-03-01T00:00:00Z' },
  { gh_id: 2, name: 'repo 2', created_at: '2024-02-01T00:00:00Z' },
  { gh_id: 1, name: 'repo 1', created_at: '2024-01-01T00:00:00Z' }
] as Repository[]

const MOCK_LATEST_REPO = {
  _id: 'abc123',
  name: 'repo 3',
  created_at: '2024-03-01T00:00:00Z'
} as unknown as WithId<Repository>

const MOCK_NEW_REPO_ARRAY = [
  {
    gh_id: 3,
    name: 'repo 3',
    created_at: '2024-03-01T00:00:00Z'
  }
] as Repository[]

const MOCK_REPO_IDS = [3, 2, 1]

const TEST_KEY_SET = new Set([1, 2])

describe('Jobs test suite:', () => {
  describe('sync utils', () => {
    beforeEach(() => {
      collections.repositories = {
        find: (_query: any, _opts: any) => ({
          toArray: async () => MOCK_REPOS
        }),
        findOne: (_query: any, _opts: any) => Promise.resolve(MOCK_LATEST_REPO)
      } as Collection<Repository>
    })

    test('[GetAllRepos] should return all repo IDs sorted', async () => {
      const repoIds = await GetAllRepoIds()

      expect(repoIds).toEqual(MOCK_REPO_IDS)
    })

    test('[GetLastEntry] should return the latest entry in the collection', async () => {
      const latestEntry = await GetLastEntry()

      expect(latestEntry).toEqual(MOCK_LATEST_REPO)
    })

    test('[FilterNewRepos] should validate that a repo is new from a cache set', () => {
      const newRepo = FilterNewRepos(MOCK_REPOS, TEST_KEY_SET)

      expect(newRepo).toEqual(MOCK_NEW_REPO_ARRAY)
    })
  })
})
