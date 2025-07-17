import { Repository } from '@models/Repository'
import { Collection, WithId } from 'mongodb'

export class RepositoryService {
  private repositoryCollection: Collection<Repository>

  constructor(collections: Collection<Repository>) {
    this.repositoryCollection = collections
  }

  /**
   * Returns a list of Repositories.
   *
   * @returns Promise
   */
  async getRepositories(): Promise<WithId<Repository>[]> {
    try {
      const repositories = await this.repositoryCollection.find({}).toArray()
      return repositories
    } catch (err) {
      throw new Error('Error fetching repositories')
    }
  }

  /**
   * Returns a single Repository or null if no repository exists with the provided id.
   *
   * @param id
   * @returns Promise
   */
  async getRepositoriesById(id: number): Promise<WithId<Repository> | null> {
    try {
      const repository = await this.repositoryCollection.findOne({
        gh_id: id
      })

      return repository
    } catch (err) {
      throw new Error('Error fetching repositories')
    }
  }
}
