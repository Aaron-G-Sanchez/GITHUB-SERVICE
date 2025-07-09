import { describe, test, expect, beforeEach } from 'bun:test'
import request from 'supertest'
import { Collection } from 'mongodb'

import { server } from '../../src/server'
import { collections } from '../../src/database/db'
import { Repository } from '../../src/models/Repository'

const MOCK_REPOS = [
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
  }
]

describe('Routes test suite: ', () => {
  describe('repositories routes', () => {
    beforeEach(() => {
      collections.repositories = {
        find: () => ({
          toArray: async () => MOCK_REPOS
        })
      } as Collection<Repository>
    })

    test('GET /repos should return a list of repositories', async () => {
      const res = await request(server)
        .get('/api/v1/repos')
        .set('Authorization', 'Bearer test-secret')
        .expect(200)

      expect(res.body).toEqual({ repos: MOCK_REPOS })
    })
  })
})
