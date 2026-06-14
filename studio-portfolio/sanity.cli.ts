import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'aiajifvh',
    dataset: 'production',
  },
  /**
   * Auto-updates disabled on purpose: it serves the latest runtime (v4+),
   * but this Studio is pinned to Sanity v3. Keep local and runtime in sync.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: false,
})
