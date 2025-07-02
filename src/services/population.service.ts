import { GITHUB_USER_REPOS_URL } from '../lib/constants.lib'
import { FetchUserRepos } from './utils/github.util'
import { connect, collections } from '../database/db'

const populateDatabase = async () => {
  const client = await connect()

  const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL)

  try {
    await collections.repositories?.insertMany(repositories)
    console.log('Repositories written to DB: ', repositories.length)
  } catch (err) {
    console.error('Error writing to DB: ', err)
  } finally {
    client.close()
  }
}

populateDatabase()
