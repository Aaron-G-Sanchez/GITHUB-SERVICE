import { describe, test, expect, beforeEach, mock } from 'bun:test'
import request from 'supertest'
import { Express } from 'express'
import { ObjectId } from 'mongodb'

import { CreateServer } from '@base/server'
import { RepositoryService } from '@services/repository.service'

const MOCK_OBJECT_ID_ONE = new ObjectId().toString()
const MOCK_OBJECT_ID_TWO = new ObjectId().toString()

const MOCK_REPO_ONE = {
  _id: MOCK_OBJECT_ID_ONE,
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

const MOCK_REPO_TWO = {
  _id: MOCK_OBJECT_ID_TWO,
  gh_id: 987654,
  name: 'Test-Repo-TWO',
  full_name: 'user/Test-Repo-Two',
  html_url: 'http://example.com/user/Test-Repo-Two',
  fork: false,
  url: 'http://api.example.com/repos/user/Test-Repo-Two',
  open_issues_count: 0,
  has_issues: true,
  created_at: '2025-06-26T23:05:15Z'
}

const MOCK_REPO_LIST = [MOCK_REPO_ONE, MOCK_REPO_TWO]

const MOCK_GET_REPOSITORIES_ERROR = new Error('Error fetching repositories')

const MOCK_SUCCESS_REPOSITORY_SERVICE = {
  getRepositories: mock().mockResolvedValue(MOCK_REPO_LIST),
  getRepositoryById: mock().mockResolvedValue(MOCK_REPO_ONE)
} as unknown as RepositoryService

const MOCK_ERROR_REPOSITORY_SERVICE = {
  getRepositories: () => Promise.reject(MOCK_GET_REPOSITORIES_ERROR),
  getRepositoryById: () => Promise.reject(MOCK_GET_REPOSITORIES_ERROR)
} as unknown as RepositoryService

describe('Routes test suite: ', () => {
  describe('repositories routes', () => {
    describe('success responses', () => {
      let server: Express

      beforeEach(() => {
        server = CreateServer(MOCK_SUCCESS_REPOSITORY_SERVICE)
      })

      test('[GET] /repos should return a list of repositories', async () => {
        const res = await request(server)
          .get('/api/v1/repos')
          .set('Authorization', 'Bearer test-secret')
          .expect(200)

        expect(res.body).toEqual({ repos: [MOCK_REPO_ONE, MOCK_REPO_TWO] })
      })

      test('[GET] /repos/:id should return a single repo instance', async () => {
        const res = await request(server)
          .get('/api/v1/repos/123456')
          .set('Authorization', 'Bearer test-secret')
          .expect(200)

        expect(res.body).toEqual({ repo: MOCK_REPO_ONE })
      })
    })

    // TODO: Add an error check to validate parsing of :id param.
    describe('error responses', () => {
      let server: Express

      beforeEach(() => {
        server = CreateServer(MOCK_ERROR_REPOSITORY_SERVICE)
      })

      test('[GET] /repos should respond with proper error response when error is thrown', async () => {
        const res = await request(server)
          .get('/api/v1/repos')
          .set('Authorization', 'Bearer test-secret')
          .expect(500)

        expect(res.body).toEqual({ error: MOCK_GET_REPOSITORIES_ERROR.message })
      })

      test('[GET] /repos/:id should respond with proper error response when error is thrown', async () => {
        const res = await request(server)
          .get('/api/v1/repos/999')
          .set('Authorization', 'Bearer test-secret')
          .expect(500)

        expect(res.body).toEqual({ error: MOCK_GET_REPOSITORIES_ERROR.message })
      })
    })
  })
})
