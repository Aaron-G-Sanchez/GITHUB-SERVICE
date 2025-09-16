import { describe, test, expect, beforeEach, mock } from 'bun:test'
import { Request, Response, NextFunction } from 'express'

import * as auth from '@middleware/auth/verifyToken'
import { AppConfig } from '@config/config.config'

const TEST_CONFIG = new AppConfig()
const TEST_SECRET = 'test-secret'

const MOCK_MIDDLEWARE = auth.ValidateToken(TEST_CONFIG)

let TEST_REQUEST: Request
let TEST_RESPONSE: Response
let TEST_NEXT: NextFunction

describe('Middleware test suite:', () => {
  describe('Auth | ValidateToken', () => {
    beforeEach(() => {
      TEST_REQUEST = {
        headers: {}
      } as Request

      TEST_RESPONSE = {
        status: mock().mockReturnThis(),
        json: mock()
      } as unknown as Response

      TEST_NEXT = mock() as NextFunction
    })

    test('should return 401 when no token is provided', () => {
      MOCK_MIDDLEWARE(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(401)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Missing or malformed Authorization header'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should return 401 when token is malformed', () => {
      TEST_REQUEST.headers.authorization = 'Wrong test-token'

      MOCK_MIDDLEWARE(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(401)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Missing or malformed Authorization header'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should return 403 when token is incorrect', () => {
      TEST_REQUEST.headers.authorization = 'Bearer wrong-token'

      MOCK_MIDDLEWARE(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(403)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Invalid token'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should call next: NextFunction when token is valid', () => {
      TEST_REQUEST.headers.authorization = `Bearer ${TEST_SECRET}`

      MOCK_MIDDLEWARE(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).not.toHaveBeenCalledWith()
      expect(TEST_NEXT).toHaveBeenCalled()
    })
  })
})
