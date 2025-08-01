import { Request, Response, Router, json } from 'express'

import { RepositoryService } from '@base/services/repository.service'
import { GithubAction } from '@library/enums.lib'
import { Issue } from '@models/Issue'
import { Repository } from '@models/Repository'

export const CreateWebhookRouter = (
  repositoryService: RepositoryService
): Router => {
  const webhookRouter = Router()

  webhookRouter.use(json())

  webhookRouter.post('/', async (req: Request, res: Response) => {
    // TODO: Authenticate request.
    const { action, issue, repository } = req.body

    if (!validateAction(action)) {
      res.status(400).send({ error: 'Missing or incorrect action' })
      return
    }

    if (!issue || !repository) {
      res.status(400).send({ error: 'Missing issue or repository' })
      return
    }

    // TODO: Implement cases for other actions. [edited, deleted, closed]
    switch (action) {
      case GithubAction.Opened:
        const issueMapping = createIssueMapping(issue)
        const repositoryIdentifiers = getRepositoryIdentifiers(repository)
        try {
          await repositoryService.addIssue(issueMapping, repositoryIdentifiers)
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error adding issue to repository'
          res.status(500).send({ error: message })
        }
        break
      default:
        res.status(200).send({ msg: 'ok; action not implemented' })
        return
    }

    res.status(200).send({ msg: 'ok' })
  })

  return webhookRouter
}

// TODO: Move to separate directory.
const validateAction = (action: string) => {
  return Object.values(GithubAction).includes(action as GithubAction)
}

const createIssueMapping = (rawIssue: any): Issue => {
  return {
    gh_id: rawIssue.id,
    number: rawIssue.number,
    state: rawIssue.state,
    title: rawIssue.title,
    body: rawIssue.body,
    repository_url: rawIssue.repository_url
  }
}

const getRepositoryIdentifiers = (
  rawRepository: any
): Pick<Repository, 'gh_id' | 'full_name'> => {
  return {
    gh_id: rawRepository.id,
    full_name: rawRepository.name
  }
}
