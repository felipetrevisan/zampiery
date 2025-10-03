import { CalendarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'list',
  title: 'Lista de Jogos',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título da Lista',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug da Lista',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'games',
      title: 'Jogos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'game' }] }],
    }),
    defineField({
      name: 'platform',
      title: 'Plataforma',
      type: 'reference',
      to: [{ type: 'game-platform' }],
    }),
    defineField({
      name: 'isClub',
      title: 'Clube?',
      type: 'boolean',
    }),
    defineField({
      name: 'club',
      title: 'Clube',
      type: 'reference',
      to: [{ type: 'club' }],
      hidden: ({ parent }) => !parent?.isClub
    }),
  ],
  preview: {
    select: {
      title: 'title',
      platform: 'platform.title',
    },
    prepare({ title, platform }) {
      return {
        title,
        subtitle: platform,
      }
    },
  },
})
