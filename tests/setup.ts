import { mock } from 'bun:test'

mock.module('@config/config.config', () => ({
  config: {
    secretKey: 'test-secret',
    environment: 'test'
  }
}))
