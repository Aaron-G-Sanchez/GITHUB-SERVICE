import { config } from '@config/config.config'
import { PopulateDatabase } from '@jobs/populate/population.job'

// TODO: Add a dry run flag.
// parse flag
// pass flag to PopulateDatabase.

const args = process.argv

/** EVALUATE ARGS */
if (args.length <= 2) {
  console.info(
    `Running in default configuration for environment: ${config.environment}`
  )
}
// Evaluate optional args.

PopulateDatabase()
  .then((client) => {
    console.log('Database population complete')
    client.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error('DB population failed:', err)
    process.exit(1)
  })
