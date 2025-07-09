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

/**
 * Object to hold all environment variables.
 *
 * @constant {Object} Config
 * @property {string} port - Exposed port
 * @property {string} environment - Current environment
 * @property {string} dbConnectionString - MongoDB connection URI
 * @property {string} secretKey - Secret key used for API auth.
 * @property {string} personalAccessToken - GitHub PAT for REST API usage.
 *
 */
export const config: Config = {
  port: getResource('PORT'),
  environment: getResource('ENVIRONMENT'),
  dbConnectionString: getResource('MONGO_DB_URI'),
  secretKey: getResource('SECRET_TOKEN'),
  personalAccessToken: getResource('GH_TOKEN')
}
