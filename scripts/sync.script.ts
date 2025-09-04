import { AppConfig } from '@config/config.config'
import { ParseRuntimeArgs } from '@base/util'
import { SyncDatabase } from '@jobs/sync/sync.job'

// TODO: Parse dry run and db env target arguments.
const args = process.argv

// TODO: Pass values returned from function into Config class.
ParseRuntimeArgs(args)

const config = new AppConfig()

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
