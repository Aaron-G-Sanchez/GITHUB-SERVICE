import { ObjectId } from 'mongodb'

export interface Repository {
  name: string
  id?: ObjectId
}
