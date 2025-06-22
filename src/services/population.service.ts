import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const TOKEN = process.env.GH_TOKEN

if (!TOKEN) throw new Error('Not GitHub Token')

const headers = {
  'User-Agent': 'aaron-g-sanchez',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${TOKEN}`
}

const sampleFetch = async () => {
  const response = await fetch(
    'https://api.github.com/users/aaron-g-sanchez/repos',
    { headers }
  )

  const data = await response.json()

  // Write sample data to a sample file.
  fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
    if (err) throw err

    console.log('File written!')
  })

  // console.log(response)
}

sampleFetch()
