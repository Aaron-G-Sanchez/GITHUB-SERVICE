import { ObjectId } from 'mongodb'

// TODO: Decide if adding the assignee is valuable.
export interface Issue {
  _id?: ObjectId
  gh_id: number
  number: number
  state: string // TODO: look into making an enum.
  title: string
  body: string
  repository_url: string
}
