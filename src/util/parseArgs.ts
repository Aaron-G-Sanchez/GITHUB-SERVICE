import { TargetEnvironment } from '@library/enums.lib'
import { Override } from '@interfaces/override.interface'

/** Evaluate the args passed at runtime. */
export const ParseRuntimeArgs = (args: string[]): Override => {
  let targetEnv: string | undefined

  for (let i = 2; i < args.length; i++) {
    const arg = args[i]

    // TODO: Add operation for dry run override.
    if (arg === '-targetEnv' || arg === '--targetEnv') {
      targetEnv = args[i + 1]
    }
  }

  if (targetEnv && !isValidTargetEnv(targetEnv)) {
    throw new Error(`Invalid target environment: ${targetEnv}`)
  }

  return { targetEnv }
}

const isValidTargetEnv = (target: string) => {
  return Object.values(TargetEnvironment).includes(target as TargetEnvironment)
}
