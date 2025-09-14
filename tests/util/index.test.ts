import { describe, test, expect } from 'bun:test'

import { ParseRuntimeArgs } from '@utils/index'
import { TargetEnvironment } from '@library/enums.lib'

const DEFAULT_COMMAND_LINE_ARGS = ['path/to/exc', 'path/to/file']

describe('Util testing suite:', () => {
  describe('ParseRuntimeArgs', () => {
    test('should check for provided target environment', () => {
      const runtimeArgs = [...DEFAULT_COMMAND_LINE_ARGS, '--targetEnv', 'dev']

      const result = ParseRuntimeArgs(runtimeArgs)

      expect(result).toBe(TargetEnvironment.Dev)
    })
  })
})
