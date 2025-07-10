import { Request, Response, Router, json } from 'express'

import { collections } from '@database/db'

export const repositoriesRouter = Router()

repositoriesRouter.use(json())

repositoriesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    // TODO: Move to separate services directory.
    const repos = await collections.repositories?.find({}).toArray()

    res.status(200).send({ repos })
  } catch (err) {
    res.status(500).send(err)
  }
})
