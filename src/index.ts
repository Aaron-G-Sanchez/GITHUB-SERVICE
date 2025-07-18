import { CreateServer } from '@base/server'
import { connect, collections } from '@database/db'
import { config } from '@config/config.config'
import { RepositoryService } from '@services/repository.service'

const PORT = config.port

connect()
  .then(() => {
    if (!collections) throw new Error('Error connecting to DB.')

    const repositoriesService = new RepositoryService(collections.repositories!)

    const server = CreateServer(repositoriesService)

    server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.error('Database connection failed', err.message)
    process.exit()
  })
