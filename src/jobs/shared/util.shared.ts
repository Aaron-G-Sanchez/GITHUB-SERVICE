import {
  NEXT_PATTERN_REG,
  GITHUB_REPO_ISSUES_URL
} from '@library/constants.lib'
import { Issue } from '@models/Issue'
import { Repository } from '@models/Repository'

/**
 * Service util to fetch all of a users GitHub repositories.
 *
 * @param endpoint GitHub API endpoint.
 * @returns list of repositories.
 */
export const FetchUserRepos = async (
  endpoint: string,
  options: RequestInit
): Promise<Repository[]> => {
  let pagesRemaining = true
  let repositoryData: Repository[] = []

  while (pagesRemaining) {
    const res = await fetchUtil(endpoint, options)

    const parsedData = await parseResponseData(res)

    repositoryData = [...repositoryData, ...parsedData]

    const linkHeaders = res.headers.get('link')

    pagesRemaining =
      linkHeaders !== null && linkHeaders.includes(`rel=\"next\"`)

    if (pagesRemaining) {
      endpoint = linkHeaders!.match(NEXT_PATTERN_REG)![0]
    }
  }

  return repositoryData
}

/**
 * Service util to fetch all issues for a given repo.
 *
 * @param repos List of repositories that have active issues.
 *
 */
export const FetchIssues = async (
  repos: Repository[],
  options: RequestInit
): Promise<Repository[]> => {
  // TODO: Look into just returning the issues.
  const enrichedRepos = repos.map(async (repo) => {
    const endpoint = `${GITHUB_REPO_ISSUES_URL}${repo.name}/issues?state=all&per_page=100&direction=asc`

    const repoIssues = await fetchUtil(endpoint, options)

    const parsedData = await parseIssues(repoIssues)

    return {
      ...repo,
      issues: parsedData
    }
  })

  return await Promise.all(enrichedRepos)
}

/**
 * Service util to filter out repositories with active issues.
 *
 * @param repos A list of all repositories.
 * @returns A filtered list of repositories with active issues.
 */
export const FilterReposWithIssues = (repos: Repository[]): Repository[] => {
  const filteredReposWithIssues = repos.filter(
    (repo) => repo.open_issues_count > 0
  )

  return filteredReposWithIssues
}

/**
 * Util to merge two lists of repositories.
 *
 */
export const MergeRepos = (
  repos: Repository[],
  reposWithIssues: Repository[]
): Repository[] => {
  const result = repos.map((repo) => {
    const repoWithIssues = reposWithIssues.find((r) => repo.gh_id === r.gh_id)
    return {
      ...repo,
      ...repoWithIssues
    }
  })

  return result
}

/**
 * Util to build the request headers.
 * @param accessToken - string from the config object.
 */
export const BuildHeaders = (accessToken: string) => {
  return {
    'User-Agent': 'aaron-g-sanchez',
    'X-GitHub-Api-Version': '2022-11-28',
    Authorization: `Bearer ${accessToken}`
  }
}

// ****** TODO: REMOVE EXPORTS FOR THESE HELPER FUNCTIONS ******

/**
 * Fetch utility function.
 *
 * @param endpoint a github API endpoint.
 * @param options optional object to override headers for testing.
 * @returns fetch API Response object
 */
export const fetchUtil = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const response = await fetch(endpoint, {
    headers: {
      ...options.headers
    }
  })
  return response
}

/**
 * Util to parse GitHub API response data for the /repos endpoint.
 *
 * @param [responseData] Fetch API Response.
 * @returns Array of Repositories.
 */
export const parseResponseData = async (
  responseData: Response
): Promise<Repository[]> => {
  const data = await responseData.json()

  // Parse necessary data from response.
  const repositories: Repository[] = data.map((repo: any) => ({
    gh_id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    fork: repo.fork,
    url: repo.url,
    open_issues_count: repo.open_issues_count,
    has_issues: repo.has_issues,
    created_at: repo.created_at
  }))

  return repositories
}

/**
 * Util to parse GitHub API response data for the /issues endpoint.
 *
 * @param responseData
 * @returns Array of issues.
 */
export const parseIssues = async (responseData: Response): Promise<Issue[]> => {
  const data = await responseData.json()

  const issues: Issue[] = data.map((issue: any) => ({
    gh_id: issue.id,
    number: issue.number,
    state: issue.state,
    title: issue.title,
    body: issue.body,
    repository_url: issue.repository_url
  }))

  return issues
}
