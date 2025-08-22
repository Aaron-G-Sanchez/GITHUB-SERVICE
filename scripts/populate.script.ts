import { PopulateDatabase } from '@jobs/populate/population.service'

// TODO: Add a dry run flag.
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
