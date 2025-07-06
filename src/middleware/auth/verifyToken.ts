import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Auth middleware to validate token.
 */
const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const SECRET = process.env.SECRET_TOKEN
  const token = req.headers.authorization

  if (!SECRET) throw new Error('No Secret token')

  if (!token) {
    res.status(404).json({ error: 'No Token' })
    return
  }

  if (safeCompare(token, SECRET)) next()
}

const safeCompare = (a: string, b: string) => {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  if (aBuf.length !== bBuf.length) return false

  return crypto.timingSafeEqual(aBuf, bBuf)
}
