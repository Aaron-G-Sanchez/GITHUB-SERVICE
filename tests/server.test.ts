import { describe, test, expect, beforeEach } from 'bun:test'
import { Express } from 'express'
import request from 'supertest'

import { CreateServer } from '@base/server'
import { RepositoryService } from '@services/repository.service'

const MOCK_REPOSITORY_SERVICE = {
  // Add mock methods as needed.
} as unknown as RepositoryService

describe('CreateServer test suite:', () => {
  let server: Express

  beforeEach(() => {
    server = CreateServer(MOCK_REPOSITORY_SERVICE)
  })

  describe('Open routes', () => {
    test('[GET] / should return status 200 and { status: "ok" }', async () => {
      const res = await request(server).get('/').expect(200)
      expect(res.body).toEqual({ status: 'ok' })
    })

    test('[GET] /health-check should return status 200 and { status: "alive" }', async () => {
      const res = await request(server).get('/health-check').expect(200)
      expect(res.body).toEqual({ status: 'alive' })
    })

    test('[GET] /api/v1/hello-world should return status 200 and { msg: "Hello, World!" }', async () => {
      const res = await request(server).get('/api/v1/hello-world').expect(200)
      expect(res.body).toEqual({ msg: 'Hello, World!' })
    })
  })

  describe('Protected routes', () => {
    test('[GET] /api/v1/repos should return 401 if no token is provided', async () => {
      const res = await request(server).get('/api/v1/repos')
      expect(res.status).toBe(401)
    })
  })

  describe('Webhook router', () => {
    test('[POST] /api/v1/webhooks should return 400 for empty body', async () => {
      const res = await request(server).post('/api/v1/webhooks').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('Fallback router', () => {
    test('[GET] unknown route should return 404 not found', async () => {
      const res = await request(server).get('/unknown-route').expect(404)
      expect(res.body).toEqual({ error: 'Not found' })
    })

    test('[POST] unknown route should return 404 not found', async () => {
      const res = await request(server).post('/route/not/defined').expect(404)
      expect(res.body).toEqual({ error: 'Not found' })
    })
  })
})
