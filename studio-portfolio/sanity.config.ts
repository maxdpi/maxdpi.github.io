import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Logan Sturrock — Portfolio',

  projectId: 'aiajifvh',
  dataset: 'production',

  // Served at http://localhost:3333/studio (and /studio in production).
  basePath: '/studio',

  // `media()` adds a Media library tab: browse every uploaded asset and
  // permanently delete the underlying files (not just remove them from a doc).
  plugins: [structureTool({structure}), media(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
