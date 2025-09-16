import { describe, test, expect } from 'bun:test'

import { ParseRuntimeArgs } from '@base/util/parseArgs'
import { TargetEnvironment } from '@library/enums.lib'
import { Override } from '@interfaces/override.interface'

const DEFAULT_COMMAND_LINE_ARGS = ['path/to/exc', 'path/to/file']

const TEST_OVERRIDE = (target: string): Override => {
  return { targetEnv: target }
}

const PARSE_RUNTIME_ARGS_ERROR = 'Invalid target environment: test'

describe('Util testing suite:', () => {
  describe('ParseRuntimeArgs', () => {
    test('should check for provided target environment: dev', () => {
      const runtimeArgs = [...DEFAULT_COMMAND_LINE_ARGS, '--targetEnv', 'dev']

      const result = ParseRuntimeArgs(runtimeArgs)

      expect(result).toEqual(TEST_OVERRIDE(TargetEnvironment.Dev))
    })

    test('should check for provided target environment: staging', () => {
      const runtimeArgs = [
        ...DEFAULT_COMMAND_LINE_ARGS,
        '--targetEnv',
        'staging'
      ]

      const result = ParseRuntimeArgs(runtimeArgs)

      expect(result).toEqual(TEST_OVERRIDE(TargetEnvironment.Staging))
    })

    test('should check for provided target environment: prod', () => {
      const runtimeArgs = [...DEFAULT_COMMAND_LINE_ARGS, '--targetEnv', 'prod']

      const result = ParseRuntimeArgs(runtimeArgs)

      expect(result).toEqual(TEST_OVERRIDE(TargetEnvironment.Prod))
    })

    describe('errors', () => {
      test('should throw error when incorrect target is passed', () => {
        const runtimeArgs = [
          ...DEFAULT_COMMAND_LINE_ARGS,
          '--targetEnv',
          'test'
        ]

        expect(() => ParseRuntimeArgs(runtimeArgs)).toThrowError(
          PARSE_RUNTIME_ARGS_ERROR
        )
      })
    })
  })
})
