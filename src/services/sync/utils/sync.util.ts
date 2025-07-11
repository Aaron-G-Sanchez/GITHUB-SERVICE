import { collections } from '@database/db'
import { Repository } from '@models/Repository'

/**
 * Util to get all repos in the db.
 *
 */
// TODO: test.
export const GetAllRepoIds = async () => {
  const cursor = collections.repositories?.find(
    {},
    { sort: { created_at: -1 }, projection: { _id: 0, gh_id: 1 } }
  )

  const repoObjects = await cursor?.toArray()
  const ids = repoObjects?.map((repo) => repo.gh_id)

  return ids
}

/**
 *  Util to get the latest created Repository from the DB.
 *
 * @returns Promise - Returns a Repository document or null | unknown
 */
// TODO: Test.
// TODO: Replace created_at with updated_at.
export const GetLastEntry = async () => {
  const entry = await collections.repositories?.findOne(
    {},
    {
      sort: { created_at: -1 },
      projection: { _id: 1, name: 1, created_at: 1 }
    }
  )

  return entry
}

/**
 * Util to filter out new repos that need to be added to the DB.
 *
 * @param repos
 * @param keySet
 * @returns
 */
export const FilterNewRepos = (
  repos: Repository[],
  keySet: Set<number>
): Repository[] => {
  return repos.filter((repo) => !keySet.has(repo.gh_id))
}
