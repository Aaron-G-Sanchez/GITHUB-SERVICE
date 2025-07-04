import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { repositoriesRouter } from './routes/repositories.router'

export const server: Express = express()

server.use(morgan(':method :url :status | :response-time ms'))

server.get('api/v1/hello-world', (req: Request, res: Response) => {
  res.status(200).json({ msg: 'Hello, World!' })
})

server.use('api/v1/repos', repositoriesRouter)
