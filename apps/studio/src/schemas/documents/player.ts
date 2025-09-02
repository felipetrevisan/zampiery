import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'player',
  title: 'Jogadores',
  icon: UsersIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
    }),
    defineField({
      name: 'favoritePosition',
      title: 'Posicao Favorita',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'favoriteTeam',
      title: 'Time Favorito',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
      favoritePosition: 'favoritePosition',
      favoriteTeam: 'favoriteTeam',
    },
    prepare({ title, media, favoritePosition, favoriteTeam }) {
      return {
        title,
        media,
        subtitle: `${favoritePosition || 'N/A'} • ${favoriteTeam || 'N/A'}`,
      }
    },
  },
})
