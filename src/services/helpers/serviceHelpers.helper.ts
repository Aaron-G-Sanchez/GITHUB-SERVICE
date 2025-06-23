import { FetchUserRepoCount } from '../utils/github.util'

/**
 * Calculates how many service calls will need to be made to the GitHub API.
 *
 * Calculations are based on requesting 100 items per page from the /repositories endpoint.
 *
 * @returns Promise<number>
 */
export const CalculateServiceCalls = async (): Promise<number> => {
  const repoCount = await FetchUserRepoCount()

  // Calculate the initial full page count required by the service, then check for
  // any partial pages.
  if (repoCount > 100) {
    let pageCount = Math.floor(repoCount / 100)

    const remainder = repoCount % 100

    return remainder ? ++pageCount : pageCount
  }

  return 1
}
