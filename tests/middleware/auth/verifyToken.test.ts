import { describe, test, expect, beforeEach, mock } from 'bun:test'
import { Request, Response, NextFunction } from 'express'

import * as auth from '../../../src/middleware/auth/verifyToken'

const TEST_SECRET = 'test-secret'

let TEST_REQUEST: Request
let TEST_RESPONSE: Response
let TEST_NEXT: NextFunction

describe('Middleware: [auth] test suite', () => {
  describe('ValidateToken', () => {
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
      auth.ValidateToken(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(401)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Missing or malformed Authorization header'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should return 401 when token is malformed', () => {
      TEST_REQUEST.headers.authorization = 'Wrong test-token'

      auth.ValidateToken(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(401)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Missing or malformed Authorization header'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should return 403 when token is incorrect', () => {
      TEST_REQUEST.headers.authorization = 'Bearer wrong-token'

      auth.ValidateToken(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).toHaveBeenCalledWith(403)
      expect(TEST_RESPONSE.json).toHaveBeenCalledWith({
        error: 'Invalid token'
      })
      expect(TEST_NEXT).not.toHaveBeenCalled()
    })

    test('should call next: NextFunction when token is valid', () => {
      TEST_REQUEST.headers.authorization = `Bearer ${TEST_SECRET}`

      auth.ValidateToken(TEST_REQUEST, TEST_RESPONSE, TEST_NEXT)

      expect(TEST_RESPONSE.status).not.toHaveBeenCalledWith()
      expect(TEST_NEXT).toHaveBeenCalled()
    })
  })
})
