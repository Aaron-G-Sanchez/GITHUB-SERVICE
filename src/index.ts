import { AppConfig } from '@config/config.config'
import { CreateServer } from '@base/server'
import { connect, collections } from '@database/db'
import { RepositoryService } from '@services/repository.service'

const config = new AppConfig()

connect(config)
  .then(() => {
    if (!collections) throw new Error('Error connecting to DB.')

    const repositoriesService = new RepositoryService(collections.repositories!)

    const server = CreateServer(config, repositoriesService)

    server.listen(config.port, () => {
      console.log(`Server listening on port: ${config.port}`)
    })
  })
  .catch((err: Error) => {
    console.error('Database connection failed', err.message)
    process.exit()
  })
