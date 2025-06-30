import { REQUEST_HEADERS, NEXT_PATTERN_REG } from '../../lib/constants.lib'
import { Repository } from '../../models/Repository'

/**
 * Service util to fetch all of a users GitHub repositories.
 *
 * @param endpoint GitHub API endpoint.
 * @returns list of repositories.
 */
export const FetchUserRepos = async (
  endpoint: string,
  options?: RequestInit
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
 * Fetch utility function.
 *
 * @param endpoint a github API endpoint.
 * @param options optional object to override headers for testing.
 * @returns fetch API Response object
 */
export const fetchUtil = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const response = await fetch(endpoint, {
    headers: {
      ...REQUEST_HEADERS,
      ...options?.headers
    }
  })
  return response
}

/**
 * Util to parse GitHub API response data for the /repos endpoint.
 *
 * @param [responseData] Fetch API Response.
 * @returns Promise<Repository> - Array of Repositories.
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
