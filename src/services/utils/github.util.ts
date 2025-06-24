import dotenv from 'dotenv'

import { GITHUB_USER_URL } from '../../lib/urls.lib'

dotenv.config()

const TOKEN = process.env.GH_TOKEN

if (!TOKEN) throw new Error('No GitHub User Token found.')

const headers = {
  'User-Agent': 'aaron-g-sanchez',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${TOKEN}`
}

/**
 * Calls the GitHub API and returns the total number of repositories for an authorized user.
 *
 * @returns [Promise<number>] The total repo count of an authorized user.
 */
export const FetchUserRepoCount = async (): Promise<number> => {
  const response = await fetchUtil(GITHUB_USER_URL)

  const repoCount = await response.json().then((data: any) => {
    const publicRepos = data.public_repos
    const privateRepos = data.total_private_repos

    return publicRepos + privateRepos
  })

  return repoCount
}

// TODO: Implement function.
// TODO: Utilize the Link headers that comes from the API response.
export const FetchUserRepos = () => {}

/**
 * Fetch utility function
 *
 * @param [string] a github API endpoint
 * @returns
 */
const fetchUtil = async (endpoint: string): Promise<Response> => {
  const response = await fetch(endpoint, { headers })
  return response
}
