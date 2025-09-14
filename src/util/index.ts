import { TargetEnvironment } from '@library/enums.lib'

/** Evaluate the args passed at runtime. */
// TODO: Create an type for the return of ParseRuntimeArgs.
export const ParseRuntimeArgs = (args: string[]): string | undefined => {
  let targetEnv: string | undefined
  let dryRun: boolean = true

  for (let i = 2; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-targetEnv' || arg === '--targetEnv') {
      targetEnv = args[i + 1]
    } else if (arg === '-dryRun' || '--dryRun') {
      // TODO: Validate dryRun arg.
      dryRun = false
    }
  }

  if (targetEnv && !isValidTargetEnv(targetEnv)) {
    console.error(`Invalid target environment: ${targetEnv}`)
  }

  return targetEnv
}

const isValidTargetEnv = (target: string) => {
  return Object.values(TargetEnvironment).includes(target as TargetEnvironment)
}
