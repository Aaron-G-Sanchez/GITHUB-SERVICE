import dotenv from 'dotenv'
dotenv.config()

const TOKEN = process.env.GH_TOKEN

if (!TOKEN) throw new Error('No GitHub User Token found.')

/** Request Headers for the GitHub API.  */
export const REQUEST_HEADERS = {
  'User-Agent': 'aaron-g-sanchez',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${TOKEN}`
}

/** URL to fetch an authorized users info. */
export const GITHUB_USER_URL = 'https://api.github.com/user'

/** URL to fetch all of an authorized users repositories. */
export const GITHUB_USER_REPOS_URL =
  'https://api.github.com/user/repos?affiliation=owner&per_page=100'

/** REGEX to get the [Next] url from the GitHub API Response Headers  */
export const NEXT_PATTERN_REG = /(?<=<)([\S]*)(?=>; rel="Next")/i
