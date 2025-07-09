import { mock } from 'bun:test'

mock.module('../src/config/config.config', () => ({
  config: {
    secretKey: 'test-secret'
  }
}))
