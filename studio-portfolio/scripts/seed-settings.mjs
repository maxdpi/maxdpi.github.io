/**
 * Patches the siteSettings singleton with starter `tagline` + `about` so the
 * front-end has distinguishable content to render. Edit these in the Studio.
 *
 * Run from studio-portfolio/:  node scripts/seed-settings.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

function getToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  const cfgPath = join(homedir(), '.config', 'sanity', 'config.json')
  if (existsSync(cfgPath)) {
    try {
      return JSON.parse(readFileSync(cfgPath, 'utf8')).authToken || null
    } catch {
      return null
    }
  }
  return null
}

const token = getToken()
if (!token) {
  console.error('✗ No Sanity token. Run `npx sanity login` first.')
  process.exit(1)
}

const client = createClient({
  projectId: 'aiajifvh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const about = [
  {
    _type: 'block',
    _key: 'about0',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'about0s0',
        text: 'Edit this About text in the Studio under Site Settings → About.',
        marks: [],
      },
    ],
  },
]

await client
  .patch('siteSettings')
  .set({tagline: 'Edit tagline in Site Settings', about})
  .commit()

console.log('✓ siteSettings tagline + about patched')
