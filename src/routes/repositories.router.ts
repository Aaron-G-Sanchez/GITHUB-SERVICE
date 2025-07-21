import { Request, Response, Router, json } from 'express'

import { RepositoryService } from '@services/repository.service'

// TODO: Remove explicit error handling from all routes.
export const CreateRepositoryRouter = (
  repositoriesService: RepositoryService
): Router => {
  const repositoriesRouter = Router()

  repositoriesRouter.use(json())

  repositoriesRouter.get('/', async (_req: Request, res: Response) => {
    try {
      const repos = await repositoriesService.getRepositories()

      res.status(200).send({ repos })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error fetching repositories'
      res.status(500).send({ error: message })
    }
  })

  // TODO: Complete route implementation.
  repositoriesRouter.get('/search', (req: Request, res: Response) => {
    const nameParam = req.query.full_name as string | undefined

    res.status(200).json({ msg: nameParam })
  })

  repositoriesRouter.get('/:id', async (req: Request, res: Response) => {
    const idParam = req.params.id

    const id = parseInt(idParam)

    if (isNaN(id) || id < 0) {
      res.status(400).send({ error: 'Invalid or missing ID' })
      return
    }

    try {
      const repo = await repositoriesService.getRepositoryById(id)

      if (!repo) {
        res.status(404).json({ error: `No resource for given id: ${id}` })
        return
      }

      res.status(200).json({ repo })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error fetching repositories'
      res.status(500).send({ error: message })
    }
  })

  return repositoriesRouter
}
