import { AppConfig } from '@config/config.config'
import { ParseRuntimeArgs } from '@base/util/parseArgs'
import { PopulateDatabase } from '@jobs/populate/population.job'

// TODO: Extract to a setup command.
const args = process.argv
const override = ParseRuntimeArgs(args)
const config = new AppConfig(override)

PopulateDatabase(config)
  .then((client) => {
    console.log('Database population complete')
    client.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error('DB population failed:', err)
    process.exit(1)
  })
