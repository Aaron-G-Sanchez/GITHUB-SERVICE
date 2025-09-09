import { describe, test, expect, beforeAll, mock, beforeEach } from 'bun:test'
import { Express } from 'express'
import request from 'supertest'

import { AppConfig } from '@config/config.config'
import { CreateServer } from '@base/server'
import { GithubAction } from '@library/enums.lib'
import { RepositoryService } from '@base/services/repository.service'

const TEST_CONFIG = new AppConfig()

const MOCK_ISSUE = {
  id: 1111,
  number: 1,
  title: 'Test Issue One',
  state: 'open',
  body: 'This is the body',
  repository_url: 'http://example.com/user/Test-Repo'
}

const MOCK_REPOSITORY = {
  id: 123456,
  name: 'Test-Repo',
  full_name: 'user/Test-Repo',
  html_url: 'http://example.com/user/Test-Repo',
  fork: false,
  url: 'http://api.example.com/repos/user/Test-Repo',
  open_issues_count: 2,
  has_issues: true,
  created_at: '2025-06-26T23:05:15Z'
}

// TODO: Rename to make usage clearer. eg. MOCK_ADD_ISSUE_REQUEST
const MOCK_WEBHOOK_REQUEST = {
  action: GithubAction.Opened,
  issue: MOCK_ISSUE,
  repository: MOCK_REPOSITORY
}
const MOCK_CLOSE_ISSUE_WEBHOOK_REQUEST = {
  action: GithubAction.Closed,
  issue: MOCK_ISSUE,
  repository: MOCK_REPOSITORY
}
const MOCK_WEBHOOK_REQUEST_MISSING_ACTION = {
  issue: MOCK_ISSUE,
  repository: MOCK_REPOSITORY
}
const MOCK_WEBHOOK_REQUEST_INCORRECT_ACTION = {
  action: 'incorrect',
  ...MOCK_WEBHOOK_REQUEST_MISSING_ACTION
}
const MOCK_WEBHOOK_REQUEST_MISSING_ISSUE = {
  action: GithubAction.Opened,
  repository: MOCK_REPOSITORY
}
const MOCK_WEBHOOK_REQUEST_MISSING_REPOSITORY = {
  action: GithubAction.Closed,
  issue: MOCK_ISSUE
}

const MOCK_SUCCESS_RESPONSE = {
  msg: 'ok'
}

const MISSING_OR_INCORRECT_GITHUB_ACTION_ERROR = new Error(
  'Missing or incorrect action'
)
const MISSING_ISSUE_OR_REPOSITORY_ERROR = new Error(
  'Missing issue or repository'
)
const ADD_ISSUES_ERROR = new Error('Error adding issue to repository')
const CLOSE_ISSUE_ERROR = new Error('Error closing issue: 1111')

const MOCK_REPOSITORY_SERVICE = {
  addIssue: mock(),
  closeIssue: mock()
} as unknown as RepositoryService

const MOCK_REPOSITORY_SERVICE_WITH_ERRORS = {
  addIssue: () => Promise.reject(ADD_ISSUES_ERROR),
  closeIssue: () => Promise.reject(CLOSE_ISSUE_ERROR)
} as unknown as RepositoryService

describe('Routes test suite:', () => {
  describe('webhook routes', () => {
    describe('success response', () => {
      let server: Express

      beforeEach(() => {
        server = CreateServer(TEST_CONFIG, MOCK_REPOSITORY_SERVICE)
      })

      describe('[POST] /webhooks', () => {
        test('should respond with 200 when issue is added', async () => {
          const res = await request(server)
            .post('/api/v1/webhooks')
            .send(MOCK_WEBHOOK_REQUEST)
            .expect(200)

          expect(res.body).toEqual(MOCK_SUCCESS_RESPONSE)
        })

        test('should respond with 200 when issue is closed', async () => {
          const res = await request(server)
            .post('/api/v1/webhooks')
            .send(MOCK_CLOSE_ISSUE_WEBHOOK_REQUEST)
            .expect(200)

          expect(res.body).toEqual(MOCK_SUCCESS_RESPONSE)
        })
      })
    })

    describe('failure responses', () => {
      describe('400 client errors', () => {
        let server: Express

        beforeAll(() => {
          server = CreateServer(TEST_CONFIG, MOCK_REPOSITORY_SERVICE)
        })

        describe('[POST] /webhooks', () => {
          test('should respond with 400 when action event is missing', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_WEBHOOK_REQUEST_MISSING_ACTION)
              .expect(400)

            expect(res.body).toEqual({
              error: MISSING_OR_INCORRECT_GITHUB_ACTION_ERROR.message
            })
          })

          test('should respond with 400 when action event is incorrect', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_WEBHOOK_REQUEST_INCORRECT_ACTION)
              .expect(400)

            expect(res.body).toEqual({
              error: MISSING_OR_INCORRECT_GITHUB_ACTION_ERROR.message
            })
          })

          test('should respond with 400 when issue payload is missing', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_WEBHOOK_REQUEST_MISSING_ISSUE)
              .expect(400)

            expect(res.body).toEqual({
              error: MISSING_ISSUE_OR_REPOSITORY_ERROR.message
            })
          })

          test('should respond with 400 when repository payload is missing', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_WEBHOOK_REQUEST_MISSING_REPOSITORY)
              .expect(400)

            expect(res.body).toEqual({
              error: MISSING_ISSUE_OR_REPOSITORY_ERROR.message
            })
          })
        })
      })

      describe('500 server errors', () => {
        let server: Express

        beforeEach(() => {
          server = CreateServer(
            TEST_CONFIG,
            MOCK_REPOSITORY_SERVICE_WITH_ERRORS
          )
        })

        describe('[POST] /webhooks', () => {
          // TODO: NIT make test name clearer. eg. ...when
          test('should respond with 500 when server error occurs', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_WEBHOOK_REQUEST)
              .expect(500)

            expect(res.body).toEqual({ error: ADD_ISSUES_ERROR.message })
          })

          test('should respond with 500 when error occurs closing an issue', async () => {
            const res = await request(server)
              .post('/api/v1/webhooks')
              .send(MOCK_CLOSE_ISSUE_WEBHOOK_REQUEST)
              .expect(500)

            expect(res.body).toEqual({ error: CLOSE_ISSUE_ERROR.message })
          })
        })
      })
    })
  })
})
