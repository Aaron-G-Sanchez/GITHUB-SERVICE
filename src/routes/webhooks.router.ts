import { Request, Response, Router, json } from 'express'

import { RepositoryService } from '@base/services/repository.service'

export const CreateWebhookRouter = (): Router => {
  const webhookRouter = Router()

  webhookRouter.use(json())

  webhookRouter.post('/', async (req: Request, res: Response) => {
    console.log(req.body)

    res.status(201).send({ msg: 'hello' })
  })

  return webhookRouter
}
