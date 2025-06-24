import fs from 'fs'

import { GITHUB_USER_REPOS_URL } from '../lib/constants.lib'
import { FetchUserRepos } from './utils/github.util'

const testPopulateDatabase = async () => {
  const repositories = await FetchUserRepos(GITHUB_USER_REPOS_URL)

  // TODO: Replace with population into the DB.
  // Write sample data to a sample file.
  fs.writeFile(
    'data.json',
    JSON.stringify(repositories, null, 2),
    'utf-8',
    (err) => {
      if (err) throw err
      console.log(`Wrote ${repositories.length} repositories.`)
    }
  )
}

testPopulateDatabase()
