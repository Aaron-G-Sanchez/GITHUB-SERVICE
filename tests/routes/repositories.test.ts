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

const GET_REPOSITORIES_ERROR = new Error('Error fetching repositories')
const INVALID_SEARCH_PARAM = new Error('Invalid or missing repository name')
const NO_RESOURCE_FOR_PROVIDED_FULL_NAME_ERROR = new Error(
  'No resource for given name: user/Fake-Repo'
)
const INVALID_STRING_ERROR = new Error('Invalid or missing ID')
const NO_RESOURCE_FOR_PROVIDED_ID_ERROR = new Error(
  'No resource for given id: 123456'
)

// TODO: Make a helper function simplify service creation.
const MOCK_REPOSITORY_SERVICE = {
  getRepositories: mock().mockResolvedValue(MOCK_REPO_LIST),
  getRepositoryById: mock().mockResolvedValue(MOCK_REPO_ONE),
  getRepositoryByFullName: mock().mockResolvedValue(MOCK_REPO_TWO)
} as unknown as RepositoryService

const MOCK_REPOSITORY_SERVICE_NO_RESOURCE = {
  getRepositoryById: mock().mockResolvedValue(null),
  getRepositoryByFullName: mock().mockResolvedValue(null)
} as unknown as RepositoryService

const MOCK_REPOSITORY_SERVICE_WITH_ERRORS = {
  getRepositories: () => Promise.reject(GET_REPOSITORIES_ERROR),
  getRepositoryById: () => Promise.reject(GET_REPOSITORIES_ERROR),
  getRepositoryByFullName: () => Promise.reject(GET_REPOSITORIES_ERROR)
} as unknown as RepositoryService

describe('Routes test suite: ', () => {
  describe('repositories routes', () => {
    describe('success responses', () => {
      let server: Express

      beforeEach(() => {
        server = CreateServer(MOCK_REPOSITORY_SERVICE)
      })

      describe('[GET] /repos', () => {
        test('should return a list of repositories', async () => {
          const res = await request(server)
            .get('/api/v1/repos')
            .set('Authorization', 'Bearer test-secret')
            .expect(200)

          expect(res.body).toEqual({ repos: [MOCK_REPO_ONE, MOCK_REPO_TWO] })
        })
      })

      describe('[GET] /repos/:id', () => {
        test('should return a single repo instance', async () => {
          const res = await request(server)
            .get('/api/v1/repos/123456')
            .set('Authorization', 'Bearer test-secret')
            .expect(200)

          expect(res.body).toEqual({ repo: MOCK_REPO_ONE })
        })
      })

      describe('[GET] /search?full_name', () => {
        test('should return a single repo instance', async () => {
          const res = await request(server)
            .get('/api/v1/repos/search?full_name=user%2FTest-Repo-Two')
            .set('Authorization', 'Bearer test-secret')
            .expect(200)

          expect(res.body).toEqual({ repo: MOCK_REPO_TWO })
        })
      })
    })

    describe('error responses', () => {
      describe('500 server failures', () => {
        let server: Express

        beforeEach(() => {
          server = CreateServer(MOCK_REPOSITORY_SERVICE_WITH_ERRORS)
        })

        describe('[GET] /repos', () => {
          test('should respond with proper error response when error is thrown', async () => {
            const res = await request(server)
              .get('/api/v1/repos')
              .set('Authorization', 'Bearer test-secret')
              .expect(500)

            expect(res.body).toEqual({
              error: GET_REPOSITORIES_ERROR.message
            })
          })
        })

        describe('[GET] /repos:id', () => {
          test('should respond with proper error response when error is thrown', async () => {
            const res = await request(server)
              .get('/api/v1/repos/999')
              .set('Authorization', 'Bearer test-secret')
              .expect(500)

            expect(res.body).toEqual({
              error: GET_REPOSITORIES_ERROR.message
            })
          })
        })

        describe('[GET] /repos/search?full_name', () => {
          test('should respond with proper error response when error is thrown', async () => {
            const res = await request(server)
              .get('/api/v1/repos/search?full_name=user%2FTest-Repo_Two')
              .set('Authorization', 'Bearer test-secret')
              .expect(500)

            expect(res.body).toEqual({
              error: GET_REPOSITORIES_ERROR.message
            })
          })
        })
      })

      describe('other failures', () => {
        let server: Express

        describe('[GET] /repos/:id', () => {
          test('should respond with 400 when id param is not a number', async () => {
            server = CreateServer(MOCK_REPOSITORY_SERVICE)

            const res = await request(server)
              .get('/api/v1/repos/abc')
              .set('Authorization', 'Bearer test-secret')
              .expect(400)

            expect(res.body).toEqual({ error: INVALID_STRING_ERROR.message })
          })

          test('should respond with 404 if no repo with provided id exists', async () => {
            server = CreateServer(MOCK_REPOSITORY_SERVICE_NO_RESOURCE)

            const res = await request(server)
              .get('/api/v1/repos/123456')
              .set('Authorization', 'Bearer test-secret')
              .expect(404)

            expect(res.body).toEqual({
              error: NO_RESOURCE_FOR_PROVIDED_ID_ERROR.message
            })
          })
        })

        describe('[GET] /search?full_name=', () => {
          test('should respond with 400 when no search param is provided', async () => {
            server = CreateServer(MOCK_REPOSITORY_SERVICE)

            const res = await request(server)
              .get('/api/v1/repos/search')
              .set('Authorization', 'Bearer test-secret')
              .expect(400)

            expect(res.body).toEqual({
              error: INVALID_SEARCH_PARAM.message
            })
          })

          test('should respond with 404 when no repository matches search param provided', async () => {
            server = CreateServer(MOCK_REPOSITORY_SERVICE_NO_RESOURCE)

            const res = await request(server)
              .get('/api/v1/repos/search?full_name=user%2FFake-Repo')
              .set('Authorization', 'Bearer test-secret')
              .expect(404)

            expect(res.body).toEqual({
              error: NO_RESOURCE_FOR_PROVIDED_FULL_NAME_ERROR.message
            })
          })
        })
      })
    })
  })
})
