import { server } from './server'
import { connect } from './database/db'
import { config } from './config/config.config'

const PORT = config.port

connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.error('Database connection failed', err.message)
    process.exit()
  })
