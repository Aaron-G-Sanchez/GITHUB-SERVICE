import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { ValidateToken } from './middleware/auth/verifyToken'
import { repositoriesRouter } from './routes/repositories.router'
import { config } from './config/config.config'

export const server: Express = express()

// OPEN ROUTES.
server.use(
  morgan(':method :url :status | :response-time ms', {
    skip: (_req, _res) => config.environment === 'test'
  })
)

server.get('/api/v1/hello-world', (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Hello, World!' })
})

// PROTECTED ROUTES.
server.use(ValidateToken)

server.use('/api/v1/repos', repositoriesRouter)
