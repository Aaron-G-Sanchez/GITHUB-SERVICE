import dotenv from 'dotenv'
import { Config } from '../interfaces/config.interface'

dotenv.config()

const getResource = (resourceKey: string): string => {
  const value = process.env[resourceKey]

  if (!value) {
    throw new Error(`Missing required environment variable: ${resourceKey}`)
  }

  return value
}

export const config: Config = {
  port: getResource('PORT'),
  environment: getResource('ENVIRONMENT'),
  dbConnectionString: getResource('MONGO_DB_URI'),
  secretKey: getResource('SECRET_TOKEN'),
  personalAccessToken: getResource('GH_TOKEN')
}
