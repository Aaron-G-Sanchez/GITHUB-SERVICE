import { server } from './server'
import dotenv from 'dotenv'

import { connect } from './database/db'

dotenv.config()

const PORT = process.env.PORT || 8080

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
