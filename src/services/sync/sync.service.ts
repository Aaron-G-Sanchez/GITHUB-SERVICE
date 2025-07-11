import { collections, connect } from '@database/db'
import { FilterNewRepos, GetAllRepoIds, GetLastEntry } from './utils/sync.util'
import { GITHUB_NEW_USER_REPOS_URL } from '@library/constants.lib'
import {
  FetchIssues,
  FetchUserRepos,
  FilterReposWithIssues,
  MergeRepos
} from '@services/shared/util.shared'

// TODO: Create functions to poll the GitHub API for newly created Repos.
// TODO: Continue logic for adding new repos.
export const SyncDatabase = async () => {
  const client = await connect()

  if (client instanceof Error) {
    throw client
  }

  try {
    const allReposInDB = await GetAllRepoIds()

    const githubIdsSet = new Set(allReposInDB)

    const latestRepoUpdated = await GetLastEntry()

    const fetchNewReposEndpoint = `${GITHUB_NEW_USER_REPOS_URL}${latestRepoUpdated?.created_at}`

    const updatedRepos = await FetchUserRepos(fetchNewReposEndpoint)

    const newRepos = FilterNewRepos(updatedRepos, githubIdsSet)

    const filteredRepos = FilterReposWithIssues(newRepos)

    const reposWithIssues = await FetchIssues(filteredRepos)

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
