import dotenv from 'dotenv'
dotenv.config()

const TOKEN = process.env.GH_TOKEN

/** Request Headers for the GitHub API.  */
export const REQUEST_HEADERS = {
  'User-Agent': 'aaron-g-sanchez',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${TOKEN}`
}

/** URL to fetch all of an authorized users repositories. */
export const GITHUB_USER_REPOS_URL =
  'https://api.github.com/user/repos?affiliation=owner&per_page=100'

export const GITHUB_REPO_ISSUES_URL =
  'https://api.github.com/repos/Aaron-G-Sanchez/'

/** REGEX to get the [Next] url from the GitHub API Response Headers  */
export const NEXT_PATTERN_REG = /(?<=<)([\S]*)(?=>; rel="Next")/i
