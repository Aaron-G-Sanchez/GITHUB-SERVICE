import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'

import { config } from '@config/config.config'

/**
 * Auth middleware to validate token.
 */
export const ValidateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' })
    return
  }

  const token = authHeader.split(' ')[1]

  const SECRET = config.secretKey

  if (!safeCompare(token, SECRET)) {
    res.status(403).json({ error: 'Invalid token' })

    return
  }

  next()
}

const safeCompare = (a: string, b: string) => {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  if (aBuf.length !== bBuf.length) return false

  return crypto.timingSafeEqual(aBuf, bBuf)
}
