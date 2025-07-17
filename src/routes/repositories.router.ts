import { Request, Response, Router, json } from 'express'

import { RepositoryService } from '@services/repository.service'

export const CreateRepositoryRouter = (
  repositoriesService: RepositoryService
): Router => {
  const repositoriesRouter = Router()

  repositoriesRouter.use(json())

  repositoriesRouter.get('/', async (_req: Request, res: Response) => {
    try {
      // TODO: Move to separate services directory.
      const repos = await repositoriesService.getRepositories()

      res.status(200).send({ repos })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error fetching repositories'
      res.status(500).send({ error: message })
    }
  })

  repositoriesRouter.get('/:id', async (req: Request, res: Response) => {
    // TODO: Move to separate directory.
    const idParam = req.params.id

    const id = parseInt(idParam)

    if (isNaN(id) || id < 0) {
      res.status(400).send({ error: 'Invalid or missing ID' })
      return
    }

    try {
      const repo = await repositoriesService.getRepositoriesById(id)

      if (!repo) {
        res.status(404).json({ msg: `No resource for given id: ${id}` })
        return
      }

      res.status(200).json({ repo })
    } catch (err) {
      res.status(500).json(err)
    }
  })

  return repositoriesRouter
}
