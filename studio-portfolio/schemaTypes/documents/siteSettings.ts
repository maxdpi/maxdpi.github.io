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
    defineField({
      name: 'passwordEnabled',
      title: 'Enable password protection',
      type: 'boolean',
      description:
        'When ON, visitors must enter the site password on the home page. ' +
        'When OFF, the home page goes straight to the portfolio.',
      initialValue: true,
      options: {layout: 'switch'},
    }),
    defineField({
      name: 'sitePassword',
      title: 'Site password',
      type: 'string',
      description:
        'Password for the entry gate on the home page. ⚠️ Soft gate only — it is ' +
        'sent to the browser over the public API and can be read by anyone technical, ' +
        'so do NOT reuse a real/important password here. Leave empty to fall back to ' +
        'the password hardcoded in index.html.',
      hidden: ({document}) => document?.passwordEnabled === false,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
