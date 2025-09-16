import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { ValidateToken } from '@middleware/auth/verifyToken'
import { AppConfig } from '@config/config.config'
import { RepositoryService } from './services/repository.service'
import { CreateRepositoryRouter } from '@routes/repositories/repositories.router'
import { CreateWebhookRouter } from '@routes/webhooks/webhooks.router'

export const CreateServer = (
  config: AppConfig,
  repositoryService: RepositoryService
) => {
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
  server.get('/', (_req: Request, res: Response) => {
    res.status(200).send({ status: 'ok' })
  })

  server.get('/health-check', (_req: Request, res: Response) => {
    res.status(200).send({ status: 'alive' })
  })

  // TODO: Delete.
  server.get('/api/v1/hello-world', (_req: Request, res: Response) => {
    res.status(200).json({ msg: 'Hello, World!' })
  })

  server.use('/api/v1/webhooks', webhookRouter)

  //** PROTECTED ROUTES. */
  server.use('/api/v1/repos', ValidateToken(config), repositoriesRouter)

  //** FALLBACK ROUTE */
  server.use((req: Request, res: Response) => {
    if (config.environment !== 'test') {
      console.warn(`Unknown route: ${req.url} from ${req.ip}`)
    }

    res.status(404).json({ error: 'Not found' })
  })

  return server
}
