import { AppConfig } from '@config/config.config'
import { ParseRuntimeArgs } from '@base/util'
import { PopulateDatabase } from '@jobs/populate/population.job'

// TODO: Parse dry run and db env target arguments.
const args = process.argv

// TODO: Pass values returned from function into Config class.
ParseRuntimeArgs(args)

const config = new AppConfig()

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
