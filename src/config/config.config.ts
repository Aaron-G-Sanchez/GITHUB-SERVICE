import dotenv from 'dotenv'
import { Config } from '@interfaces/config.interface'
import { Override } from '@interfaces/override.interface'

export class AppConfig implements Config {
  port: string
  environment: string
  dbConnectionString: string
  secretKey: string
  personalAccessToken: string

  constructor(overrides?: Override) {
    dotenv.config()

    this.port = this._getResource('PORT')
    this.environment = this._getResource('ENVIRONMENT')
    this.secretKey = this._getResource('SECRET_TOKEN')
    this.personalAccessToken = this._getResource('GH_TOKEN')
    this.dbConnectionString = this._getDBConnectionString(this.environment)

    // TODO: Parse the override object for dry run operation.
    if (overrides && overrides.targetEnv) {
      this.dbConnectionString = this._getDBConnectionString(overrides.targetEnv)
    }
  }

  private _getResource(resourceKey: string): string {
    const value = process.env[resourceKey]

    if (!value) {
      throw new Error(`Missing required environment variable: ${resourceKey}`)
    }

    return value
  }

  private _getDBConnectionString(env: string): string {
    switch (env) {
      case 'staging':
        return this._getResource('MONGO_DB_URI_STAGING')
      case 'prod':
        return this._getResource('MONGO_DB_CONNECTION_PROD')
      default:
        return this._getResource('MONGO_DB_URI')
    }
  }
}
