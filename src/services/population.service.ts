import { GITHUB_USER_REPOS_URL } from '../lib/constants.lib'
import { FetchUserRepos } from './utils/github.util'
import { connect, collections } from '../database/db'
import { MongoClient } from 'mongodb'

export const PopulateDatabase = async (): Promise<MongoClient> => {
  const client = await connect()

  const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL)

  try {
    await collections.repositories?.insertMany(repositories)
    console.log('Repositories written to DB: ', repositories.length)
  } catch (err) {
    console.error('Error writing to DB: ', err)
  }

  return client
}
