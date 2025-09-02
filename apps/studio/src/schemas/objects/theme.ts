import { defineType } from 'sanity'

export default defineType({
  name: 'theme',
  title: 'Tema',
  type: 'object',
  fields: [
    {
      name: 'schema',
      title: 'Esquema',
      type: 'string',
      initialValue: 'system',
      options: {
        list: [
          { title: 'Sistema', value: 'system' },
          { title: 'Escuro', value: 'dark' },
          { title: 'Claro', value: 'light' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    },
    {
      name: 'color',
      title: 'Cor',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { title: 'Padrão', value: 'default' },
          { title: 'Azul', value: 'blue' },
          { title: 'Roxo', value: 'purple' },
          { title: 'Ambar', value: 'amber' },
          { title: 'Rosa', value: 'rose' },
          { title: 'Laranja', value: 'orange' },
          { title: 'Teal', value: 'teal' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    },
  ],
})
