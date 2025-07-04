import { ObjectId } from 'mongodb'
import { Issue } from './Issue'

export interface Repository {
  _id?: ObjectId // TODO: Look into using the GitHub ID for easy uniqueness check.
  gh_id: number
  name: string
  full_name: string
  html_url: string
  fork: boolean
  url: string
  created_at: string
  open_issues_count: number
  has_issues: boolean
  issues?: Issue[]
}
