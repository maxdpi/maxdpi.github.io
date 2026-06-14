/**
 * Seed script — uploads the existing static images as Sanity assets and
 * publishes `project` documents (K7, Maar) plus the siteSettings singleton.
 *
 * Auth: uses the Sanity CLI token from `npx sanity login` (read from
 * ~/.config/sanity/config.json), or the SANITY_AUTH_TOKEN env var.
 * No token is written to the repo.
 *
 * Run from studio-portfolio/:  node scripts/seed.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {join, basename} from 'node:path'

const PROJECT_ID = 'aiajifvh'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

// Static site images live one level up, in the app folder.
const APP_DIR = join(process.cwd(), '..')
const IMAGES = join(APP_DIR, 'images')

function getToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  const cfgPath = join(homedir(), '.config', 'sanity', 'config.json')
  if (existsSync(cfgPath)) {
    try {
      const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
      if (cfg.authToken) return cfg.authToken
    } catch {
      /* ignore */
    }
  }
  return null
}

const token = getToken()
if (!token) {
  console.error(
    '\n✗ No Sanity auth token found.\n  Run `npx sanity login` in studio-portfolio/ first,\n  or set SANITY_AUTH_TOKEN.\n',
  )
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
})

// Natural sort so 07 < 07a < 08, Maar1 < Maar2, etc.
const natCmp = (a, b) =>
  basename(a).localeCompare(basename(b), undefined, {numeric: true, sensitivity: 'base'})

async function uploadImage(relPath, label) {
  const full = join(IMAGES, relPath)
  if (!existsSync(full)) {
    console.warn(`  ! missing ${relPath}, skipping`)
    return null
  }
  const buf = await readFile(full)
  const asset = await client.assets.upload('image', buf, {filename: basename(relPath)})
  console.log(`  ↑ ${label || relPath} -> ${asset._id}`)
  return asset._id
}

function imageField(assetId, alt) {
  if (!assetId) return undefined
  return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, ...(alt ? {alt} : {})}
}

function galleryMember(assetId, alt) {
  // _key is required for array items; derive a stable one from the asset id.
  return {_type: 'image', _key: assetId.replace(/[^a-z0-9]/gi, '').slice(0, 12), asset: {_type: 'reference', _ref: assetId}, ...(alt ? {alt} : {})}
}

async function buildProject({title, slug, order, year, coverRel, galleryRels, coverAlt}) {
  console.log(`\n• ${title}`)
  const coverId = coverRel ? await uploadImage(coverRel, `${title} cover`) : null
  const galleryIds = []
  for (const rel of galleryRels) {
    const id = await uploadImage(rel)
    if (id) galleryIds.push(id)
  }
  const doc = {
    _type: 'project',
    title,
    slug: {_type: 'slug', current: slug},
    order,
    ...(year ? {year} : {}),
    ...(coverId ? {mainImage: imageField(coverId, coverAlt)} : {}),
    gallery: galleryIds.map((id) => galleryMember(id, title)),
  }
  // Stable id keyed on slug so re-running updates instead of duplicating.
  const _id = `project-${slug}`
  const created = await client.createOrReplace({_id, ...doc})
  console.log(`  ✓ published ${created._id} (${galleryIds.length} gallery images)`)
  return created
}

async function main() {
  console.log(`Seeding project ${PROJECT_ID}/${DATASET} from ${IMAGES}`)

  // K7 — gallery 01..17 (+07a), cover = 01.
  const k7Rels = ['01', '02', '03', '04', '05', '06', '07', '07a', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17']
    .map((n) => `k7/${n}.jpg`)
    .filter((p) => existsSync(join(IMAGES, p)))
    .sort(natCmp)
  await buildProject({
    title: 'K7',
    slug: 'k7',
    order: 1,
    coverRel: k7Rels[0],
    galleryRels: k7Rels,
    coverAlt: 'K7',
  })

  // Maar — cover = logo, gallery = Maar1..6.
  const maarRels = ['Maar1', 'Maar2', 'Maar3', 'Maar4', 'Maar5', 'Maar6']
    .map((n) => `maar/${n}.jpg`)
    .filter((p) => existsSync(join(IMAGES, p)))
    .sort(natCmp)
  await buildProject({
    title: 'Maar',
    slug: 'maar',
    order: 2,
    coverRel: existsSync(join(IMAGES, 'maar/Maar-Logo.jpg')) ? 'maar/Maar-Logo.jpg' : maarRels[0],
    galleryRels: maarRels,
    coverAlt: 'Maar',
  })

  // siteSettings singleton — featured image + basics.
  console.log('\n• Site Settings')
  const featuredRel = existsSync(join(IMAGES, 'featured.JPG')) ? 'featured.JPG' : 'featured.jpg'
  const featuredId = await uploadImage(featuredRel, 'featured')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Logan Sturrock',
    ...(featuredId ? {featuredImage: imageField(featuredId, 'Featured')} : {}),
    email: 'hello@logansturrock.com',
  })
  console.log('  ✓ published siteSettings')

  console.log('\n✓ Seed complete.')
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err.message)
  process.exit(1)
})
