import { ListIcon } from '@sanity/icons'
import { orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ranking-list',
  title: 'Listas de Ranking',
  icon: ListIcon,
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'players',
      title: 'Pessoas',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'player' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      players: 'players',
    },
    prepare({ title, players }) {
      return {
        title,
        subtitle: players ? `${players.length} pessoas` : '0 pessoas',
      }
    },
  },
})
