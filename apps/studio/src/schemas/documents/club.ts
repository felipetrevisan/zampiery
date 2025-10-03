import { ControlsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'club',
  title: 'Clube',
  type: 'document',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Clube',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'formation',
      title: 'Formação',
      type: 'club-lineup',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      }
    },
  },
})
