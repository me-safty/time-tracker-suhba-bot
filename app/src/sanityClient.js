import { createClient } from '@sanity/client';
require('dotenv').config()

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
	apiVersion: '2021-03-25',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})