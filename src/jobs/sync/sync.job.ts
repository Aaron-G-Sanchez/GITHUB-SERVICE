import { AppConfig } from '@config/config.config'
import { collections, connect } from '@database/db'
import { FilterNewRepos, GetAllRepoIds, GetLastEntry } from './utils/sync.util'
import { GITHUB_NEW_USER_REPOS_URL } from '@library/constants.lib'
import {
  BuildHeaders,
  FetchIssues,
  FetchUserRepos,
  FilterReposWithIssues,
  MergeRepos
} from '@jobs/shared/util.shared'

export const SyncDatabase = async (config: AppConfig) => {
  const client = await connect(config)

  if (client instanceof Error) {
    throw client
  }

  const requestHeaders = BuildHeaders(config.personalAccessToken)

  try {
    const allReposInDB = await GetAllRepoIds()

    const githubIdsSet = new Set(allReposInDB)

    const latestRepoUpdated = await GetLastEntry()

    const fetchNewReposEndpoint = `${GITHUB_NEW_USER_REPOS_URL}${latestRepoUpdated?.created_at}`

    const updatedRepos = await FetchUserRepos(fetchNewReposEndpoint, {
      headers: requestHeaders
    })

    const newRepos = FilterNewRepos(updatedRepos, githubIdsSet)

    const filteredRepos = FilterReposWithIssues(newRepos)

    const reposWithIssues = await FetchIssues(filteredRepos, {
      headers: requestHeaders
    })

    const mergedRepos = MergeRepos(newRepos, reposWithIssues)

    await collections.repositories?.insertMany(mergedRepos)
  } catch (err) {
    client.close()

    if (err instanceof Error) {
      const error = err as Error
      throw new Error(`Error writing to db: ${error.message}`)
    } else {
      throw new Error('Error writing to DB.')
    }
  }

  return client
}
