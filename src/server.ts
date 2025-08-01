import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { ValidateToken } from '@middleware/auth/verifyToken'
import { config } from '@config/config.config'
import { RepositoryService } from './services/repository.service'
import { CreateRepositoryRouter } from '@routes/repositories/repositories.router'
import { CreateWebhookRouter } from '@routes/webhooks/webhooks.router'

export const CreateServer = (repositoryService: RepositoryService) => {
  const repositoriesRouter = CreateRepositoryRouter(repositoryService)
  const webhookRouter = CreateWebhookRouter(repositoryService)

  const server: Express = express()

  //** LOGGING MIDDLEWARE. */
  server.use(
    morgan(':method :url :status | :response-time ms', {
      skip: (_req, _res) => config.environment === 'test'
    })
  )

  //** OPEN ROUTES. */
  server.get('/api/v1/hello-world', (_req: Request, res: Response) => {
    res.status(200).json({ msg: 'Hello, World!' })
  })
  server.use('/api/v1/webhooks', webhookRouter)

  //** PROTECTED ROUTES. */
  server.use(ValidateToken)
  server.use('/api/v1/repos', repositoriesRouter)

  return server
}
