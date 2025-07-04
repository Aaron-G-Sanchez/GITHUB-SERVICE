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

    const filteredRepos = FilterReposWithIssues(repositories)

    const reposWithIssues = await FetchIssues(filteredRepos)

    const mergedRepos = MergeRepos(repositories, reposWithIssues)

    await collections.repositories?.insertMany(mergedRepos)
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
