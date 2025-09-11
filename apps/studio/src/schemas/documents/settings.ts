import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configurações',
  icon: CogIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título do App',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Este campo não pode estar vazio.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'theme',
      title: 'Tema',
      type: 'theme',
    }),
    defineField({
      name: 'showBackgroundEffect',
      title: 'Efeito de Fundo?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'backgroundEffectType',
      title: 'Tipo Efeito de Fundo',
      type: 'string',
      initialValue: 'hole',
      options: {
        list: [
          { title: 'Estrelas', value: 'stars' },
          { title: 'Buraco Negro', value: 'hole' },
        ],
      },
      hidden: ({ parent }) => !parent?.showBackgroundEffect,
    }),
  ],
})
