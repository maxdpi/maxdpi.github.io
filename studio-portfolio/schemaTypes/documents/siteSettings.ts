import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

/**
 * Singleton for the site-wide bits that were hardcoded placeholders in the
 * markup: the name/tagline, the featured (home) image, and the About /
 * Contact info panels.
 *
 * The front-end (../portfolio.html) renders each of these fields when present,
 * falling back to the static markup when a field is empty.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Logan Sturrock',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured (home) image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alternative text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
