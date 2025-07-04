import fs from 'fs'
import { MongoClient } from 'mongodb'

import { GITHUB_USER_REPOS_URL } from '../lib/constants.lib'
import {
  FetchIssues,
  FetchUserRepos,
  FilterReposWithIssues,
  MergeRepos
} from './utils/github.util'
import { connect, collections } from '../database/db'

export const PopulateDatabase = async (): Promise<MongoClient> => {
  let client = await connect()

  if (client instanceof Error) {
    throw client
  }

  try {
    const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL)

    // TODO: Add tests.
    const filteredRepos = FilterReposWithIssues(repositories)
    // TODO: Add population strategy for the issues.
    // - Need to enrich the original repositories array with a repos respective issue set
    const reposWithIssues = await FetchIssues(filteredRepos)

    const mergedRepos = MergeRepos(repositories, reposWithIssues)

    // TODO: Populate issues.
    // TODO: Save the issue._id in the repository.issues array.
    // TODO: Remove file write once function is finalized.
    fs.writeFile(
      'data.json',
      JSON.stringify(mergedRepos, null, 2),
      'utf-8',
      (err) => {
        if (err) throw err

        console.log(`files written: ${mergedRepos.length}`)
      }
    )

    await collections.repositories?.insertMany(repositories)
  } catch (err) {
    client.close()

    if (err instanceof Error) {
      const error = err as Error
      throw new Error(`Error writing to db: ${error.message} `)
    } else {
      throw new Error('Error writing to DB.')
    }
  }

  return client
}
