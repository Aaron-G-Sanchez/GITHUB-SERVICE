import { Request, Response, Router, json } from 'express'

import { RepositoryService } from '@base/services/repository.service'
import { GithubAction } from '@library/enums.lib'

export const CreateWebhookRouter = (
  repositoryService: RepositoryService
): Router => {
  const webhookRouter = Router()

  webhookRouter.use(json())

  webhookRouter.post('/', async (req: Request, res: Response) => {
    // TODO: Authenticate request.
    console.log(req.body)

    // TODO: Implement route.
    // Determine what action was completed.
    // - opened, closed,edited, deleted
    // Parse out the issue details that need to be added (name, url, etc)
    // Find the parent repo by gh_id
    // Push the issue into the parent repos `issues` list

    res.status(200).send({ msg: 'ok' })
  })

  return webhookRouter
}
