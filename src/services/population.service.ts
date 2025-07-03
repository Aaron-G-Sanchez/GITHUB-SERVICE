import { MongoClient } from 'mongodb'

import { GITHUB_USER_REPOS_URL } from '../lib/constants.lib'
import { FetchUserRepos, FilterReposWithIssues } from './utils/github.util'
import { connect, collections } from '../database/db'

export const PopulateDatabase = async (): Promise<MongoClient> => {
  let client = await connect()

  if (client instanceof Error) {
    throw client
  }

  try {
    const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL)

    const reposWithIssues = FilterReposWithIssues(repositories)
    // TODO: Add population strategy for the issues.
    // - Should  loop through the repositories array and fetch issues for repos that have open issues.

    await collections.repositories?.insertMany(repositories)
    console.log('Repositories written to DB: ', repositories.length)
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
