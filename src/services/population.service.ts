import fs from 'fs'
import dotenv from 'dotenv'

import { Repository } from '../models/Repository'
import { CalculateServiceCalls } from './helpers/serviceHelpers.helper'
dotenv.config()

const TOKEN = process.env.GH_TOKEN

if (!TOKEN) throw new Error('No GitHub Token')

const headers = {
  'User-Agent': 'aaron-g-sanchez',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${TOKEN}`
}

const sampleFetch = async () => {
  // TODO: Get a count of all repos owned by user -
  // Will be used to fetch all necessary pages of repos.

  const serviceCalls = await CalculateServiceCalls()

  console.log(serviceCalls)

  // // TODO: Move to separate file.
  // const response = await fetch(
  //   'https://api.github.com/user/repos?affiliation=owner&per_page=100',
  //   { headers }
  // )

  // const data = await response.json()

  // // Parse necessary data from response.
  // const repositories: Repository[] = data.map((repo: any) => ({
  //   gh_id: repo.id,
  //   name: repo.name,
  //   full_name: repo.full_name,
  //   html_url: repo.html_url,
  //   fork: repo.fork,
  //   url: repo.url,
  //   created_at: repo.created_at,
  //   open_issues_count: repo.open_issues_count,
  //   has_issues: repo.has_issues
  // }))

  // // Write sample data to a sample file.
  // fs.writeFile(
  //   'data.json',
  //   JSON.stringify(repositories, null, 2),
  //   'utf-8',
  //   (err) => {
  //     if (err) throw err

  //     console.log(`Wrote ${repositories.length} repositories.`)
  //   }
  // )
}

sampleFetch()
