import { config } from '@config/config.config'

/** Evaluate the args passed at runtime. */
export const ParseRuntimeArgs = (args: string[]) => {
  let env: string | undefined
  let dryRun: boolean = true

  for (let i = 2; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-env' || arg === '--env') {
      console.log(args[i + 1])
      env = args[i + 1]
    } else if (arg === '-dryRun' || '--dryRun') {
      dryRun = false
    }
  }

  console.log('env: ', env)
  console.log('dryRun: ', dryRun)
}
