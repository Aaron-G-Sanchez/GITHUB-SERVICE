import dotenv from 'dotenv'
import { Config } from '@interfaces/config.interface'

// TODO: Refactor into class.
export class AppConfig implements Config {
  port: string
  environment: string
  dbConnectionString: string
  secretKey: string
  personalAccessToken: string

  constructor() {
    dotenv.config()

    this.port = this._getResource('PORT')
    this.environment = this._getResource('ENVIRONMENT')
    // TODO: Check the environment target.
    this.dbConnectionString = this._getResource('MONGO_DB_URI')
    this.secretKey = this._getResource('SECRET_TOKEN')
    this.personalAccessToken = this._getResource('GH_TOKEN')
  }

  private _getResource(resourceKey: string): string {
    const value = process.env[resourceKey]

    if (!value) {
      throw new Error(`Missing required environment variable: ${resourceKey}`)
    }

    return value
  }
}
