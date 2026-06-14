import type {StructureResolver} from 'sanity/structure'
import {CogIcon, ImageIcon} from '@sanity/icons'

/**
 * Custom desk structure:
 * - "Site Settings" as a single, editable singleton document.
 * - "Projects" as a normal document list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects').icon(ImageIcon),
    ])
