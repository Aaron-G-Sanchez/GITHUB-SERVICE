import { mock } from 'bun:test'

class MockAppConfig {
  port = '4200'
  environment = 'TEST'
  dbConnectionString = 'http://test.com'
  secretKey = 'test-secret'
  personalAccessToken = 'test-secret'
}

mock.module('@config/config.config', () => ({
  AppConfig: MockAppConfig
}))
