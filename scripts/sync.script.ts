import { AppConfig } from '@config/config.config'
import { ParseRuntimeArgs } from '@base/util/parseArgs'
import { SyncDatabase } from '@jobs/sync/sync.job'

// TODO: Extract to a set up command.
const args = process.argv
const override = ParseRuntimeArgs(args)
const config = new AppConfig(override)

SyncDatabase(config)
  .then((client) => {
    console.log('Database synchronization complete ')
    client.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error('DB sync failed:', err)
    process.exit(1)
  })
