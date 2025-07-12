import { SyncDatabase } from '@services/sync/sync.service'

SyncDatabase()
  .then((client) => {
    console.log('Database synchronization complete ')
    client.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error('DB sync failed:', err)
    process.exit(1)
  })
