import { SyncDatabase } from '@services/sync/sync.service'

SyncDatabase()
  .then((client) => {
    // TODO: Update when done testing.
    console.log('TEST COMPLETE')
    client.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error('TEST FAILED:', err)
    process.exit(1)
  })
