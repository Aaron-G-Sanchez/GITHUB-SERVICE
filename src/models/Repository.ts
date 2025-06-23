import { ObjectId } from 'mongodb'

export interface Repository {
  id?: ObjectId
  gh_id: number
  name: string
  has_issues: boolean
}
