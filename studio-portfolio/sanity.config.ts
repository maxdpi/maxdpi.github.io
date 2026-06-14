import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Logan Sturrock — Portfolio',

  projectId: 'aiajifvh',
  dataset: 'production',

  // Served at http://localhost:3333/studio (and /studio in production).
  basePath: '/studio',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
