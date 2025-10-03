import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'club-lineup-position',
  title: 'Posição',
  icon: UsersIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'positionX',
      title: 'Posição X',
      type: 'number',
    }),
    defineField({
      name: 'positionY',
      title: 'Posição Y',
      type: 'number',
    }),
    defineField({
      name: 'player',
      title: 'Jogador',
      type: 'reference',
      to: [{ type: 'player' }],
    }),
    defineField({
      name: 'role',
      title: 'Função',
      type: 'string',
      options: {
        list: ['GK', 'LB', 'RB', 'CB', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'],
      },
    })
  
  ],
})
