import { Issue } from '@models/Issue'
import { Repository } from '@models/Repository'
import { Collection, WithId } from 'mongodb'

export class RepositoryService {
  private repositoryCollection: Collection<Repository>

  constructor(collections: Collection<Repository>) {
    this.repositoryCollection = collections
  }

  // TODO: Add unit tests for these methods.
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
  async getRepositoryById(id: number): Promise<WithId<Repository> | null> {
    try {
      const repository = await this.repositoryCollection.findOne({
        gh_id: id
      })

      return repository
    } catch (err) {
      throw new Error('Error fetching repositories')
    }
  }

  /**
   * Returns a single Repository or null if no repository exists with the provided repository name.
   *
   * @param repositoryName
   * @returns Promise
   */
  async getRepositoryByFullName(
    repositoryName: string
  ): Promise<WithId<Repository> | null> {
    try {
      const repository = await this.repositoryCollection.findOne({
        full_name: repositoryName
      })

      return repository
    } catch (err) {
      throw new Error('Error fetching repositories')
    }
  }

  /**
   * Adds an issue to the provided repositories issue list.
   *
   *
   * @param issue - The new issue to add to a repository.
   * @param repositoryIdentifiers - The identifiers used to find the repository to be updated.
   */
  async addIssue(
    issue: Issue,
    repositoryIdentifiers: Pick<Repository, 'gh_id' | 'full_name'>
  ) {
    const query = { gh_id: repositoryIdentifiers.gh_id }
    const update = { $push: { issues: issue }, $inc: { open_issues_count: 1 } }
    try {
      await this.repositoryCollection.updateOne(query, update)
    } catch (err) {
      throw new Error('Error adding issue to repository')
    }
  }
}
