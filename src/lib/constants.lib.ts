/** URL to fetch all of an authorized users repositories. */
export const GITHUB_USER_REPOS_URL =
  'https://api.github.com/user/repos?sort=created&affiliation=owner&per_page=100'

export const GITHUB_NEW_USER_REPOS_URL =
  'https://api.github.com/user/repos?sort=created&affiliation=owner&since='

export const GITHUB_REPO_ISSUES_URL =
  'https://api.github.com/repos/Aaron-G-Sanchez/'

/** REGEX to get the [Next] url from the GitHub API Response Headers  */
export const NEXT_PATTERN_REG = /(?<=<)([\S]*)(?=>; rel="Next")/i
