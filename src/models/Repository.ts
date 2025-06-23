import { ObjectId } from 'mongodb'

export interface Repository {
  id?: ObjectId
  gh_id: number
  name: string
  full_name: string
  html_url: string
  fork: boolean
  url: string
  created_at: string
  open_issues_count: number
  has_issues: boolean
}
