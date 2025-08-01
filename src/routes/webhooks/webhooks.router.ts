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
    const { action } = req.body

    // TODO: Implement route.
    if (!validateAction(action)) {
      res.status(400).send({ error: 'Missing or incorrect action' })
      return
    }

    switch (action) {
      case GithubAction.Opened:
        console.log('OPENED')
        break
      case GithubAction.Closed:
        console.log('CLOSED')
        break
      case GithubAction.Deleted:
        console.log('DELETED')
        break
      case GithubAction.Edited:
        console.log('EDITED')
        break
      default:
        break
    }
    // Parse out the issue details that need to be added (name, url, etc)
    // Find the parent repo by gh_id
    // Push the issue into the parent repos `issues` list

    res.status(200).send({ msg: 'ok' })
  })

  return webhookRouter
}

// TODO: Move to separate directory.
const validateAction = (action: string) => {
  console.log(action)
  return Object.values(GithubAction).includes(action as GithubAction)
}
