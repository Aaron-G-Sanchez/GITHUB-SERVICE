import { MongoClient } from 'mongodb'

import { GITHUB_USER_REPOS_URL } from '@library/constants.lib'
import {
  FetchIssues,
  FetchUserRepos,
  FilterReposWithIssues,
  MergeRepos
} from '@jobs-utils/util.shared'
import { connect, collections } from '@database/db'

/**
 * Function to populate the connected database.
 *
 * @returns Promise<MongoClient> - Mongo client to be closed by the calling script.
 *
 */
export const PopulateDatabase = async (): Promise<MongoClient> => {
  // TODO: Add result of `dryRun` flag.
  const client = await connect()

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
