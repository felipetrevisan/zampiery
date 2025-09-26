import { ControlsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'game-platform',
  title: 'Plataformas',
  type: 'document',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título do Jogo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug do Jogo',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
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
