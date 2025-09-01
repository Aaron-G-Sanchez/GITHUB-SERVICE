import { config } from '@config/config.config'
import { TargetEnvironment } from '@library/enums.lib'

/** Evaluate the args passed at runtime. */
export const ParseRuntimeArgs = (args: string[]): boolean => {
  let targetEnv: string | undefined
  let dryRun: boolean = true

  for (let i = 2; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-targetEnv' || arg === '--targetEnv') {
      targetEnv = args[i + 1]
    } else if (arg === '-dryRun' || '--dryRun') {
      dryRun = false
    }
  }

  if (targetEnv && validateTargetEnv(targetEnv)) {
    switch (targetEnv) {
      case TargetEnvironment.Staging:
        break
      case TargetEnvironment.Prod:
      default:
        console.info(
          `Running in default configuration for environment: ${config.environment}`
        )
        break
    }
  }
  console.log('env: ', targetEnv)
  console.log('dryRun: ', dryRun)
  return dryRun
}

const validateTargetEnv = (target: string) => {
  return Object.values(TargetEnvironment).includes(target as TargetEnvironment)
}
