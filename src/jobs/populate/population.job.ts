import { MongoClient } from 'mongodb'

import { AppConfig } from '@config/config.config'
import { GITHUB_USER_REPOS_URL } from '@library/constants.lib'
import {
  FetchIssues,
  FetchUserRepos,
  FilterReposWithIssues,
  MergeRepos,
  BuildHeaders
} from '@jobs-utils/util.shared'
import { connect, collections } from '@database/db'

/**
 * Function to populate the connected database.
 *
 * @param [config] - The applications configuration data.
 * @returns Promise<MongoClient> - Mongo client to be closed by the calling script.
 *
 */
// TODO: Add config arg that will be passed to the connect function.
export const PopulateDatabase = async (
  config: AppConfig
): Promise<MongoClient> => {
  // TODO: Add results of flag: dryRun.

  const client = await connect(config)

  if (client instanceof Error) {
    throw client
  }

  const requestHeaders = BuildHeaders(config.personalAccessToken)

  try {
    const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL, {
      headers: requestHeaders
    })

    const filteredRepos = FilterReposWithIssues(repositories)

    const reposWithIssues = await FetchIssues(filteredRepos, {
      headers: requestHeaders
    })

    const mergedRepos = MergeRepos(repositories, reposWithIssues)

    // TODO: Log overview of data that would be written to DB if doing dry run.
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
