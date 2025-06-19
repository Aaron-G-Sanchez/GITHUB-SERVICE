import { ObjectId } from 'mongodb'
import { Request, Response, Router, json } from 'express'

import { collections } from '../util/db'
// import { Repository } from '../models/Repository'

export const repositoriesRouter = Router()

repositoriesRouter.use(json())

repositoriesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const repos = await collections.repositories?.find({}).toArray()

    res.status(200).send({ repos })
  } catch (err) {
    res.status(500).send(err)
  }
})

repositoriesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newRepo = req.body
    const result = await collections.repositories?.insertOne(newRepo)

    if (!result) {
      res.status(500).send({ msg: 'failed to create a new repo' })
      return
    }

    res
      .status(201)
      .send({
        msg: `Successfully created a new repo with id ${result.insertedId}`
      })
  } catch (err) {
    console.error(err)
    res.status(400).send(err)
  }
})
