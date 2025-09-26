import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'team',
  title: 'Times',
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
      name: 'country',
      title: 'País',
      type: 'string',
    }),
    defineField({
      name: 'continent',
      title: 'Continente',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'shield',
      title: 'Escudo',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'shield',
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      }
    },
  },
})
