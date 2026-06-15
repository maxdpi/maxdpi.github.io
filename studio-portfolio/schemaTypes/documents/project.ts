import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * A single portfolio project (e.g. "K7", "Maar").
 *
 * Maps to the existing site: each project is a menu entry under "Projects"
 * and renders as a full-bleed, click-to-advance image gallery. `mainImage`
 * is the cover/featured frame; `gallery` is the sequence cycled on click.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used as the project id in the URL/menu. Generated from the title.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Manual sort order in the menu (lower numbers appear first).',
      initialValue: 0,
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover image',
      type: 'image',
      description: 'The featured/cover frame. Falls back to the first gallery image if empty.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.warning('Alt text improves accessibility and SEO.'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Images cycled through on click, in order.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.warning('Alt text improves accessibility and SEO.'),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).warning('Add at least one image.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Optional rich-text description for the project.',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year (or range) the work was made, e.g. "2024".',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External link',
      type: 'url',
      description: 'Optional link out (shop, write-up, etc.).',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  orderings: [
    {
      title: 'Menu order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'year', media: 'mainImage', gallery0: 'gallery.0'},
    prepare({title, subtitle, media, gallery0}) {
      return {title, subtitle, media: media || gallery0}
    },
  },
})
