import { defineType } from 'sanity'

export default defineType({
  name: 'game',
  title: 'Jogo',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'date', title: 'Data do Jogo', type: 'date' },
    { name: 'player1', title: 'Jogador 1', type: 'reference', to: [{ type: 'player' }] },
    { name: 'player2', title: 'Jogador 2', type: 'reference', to: [{ type: 'player' }] },
    { name: 'played', title: 'Jogo já ocorreu?', type: 'boolean', initialValue: false },
    {
      name: 'score1',
      title: 'Placar Jogador 1',
      type: 'number',
      hidden: ({ parent }) => !parent.played,
    },
    {
      name: 'score2',
      title: 'Placar Jogador 2',
      type: 'number',
      hidden: ({ parent }) => !parent.played,
    },
    {
      name: 'attendance1',
      title: 'Jogador 1 compareceu?',
      type: 'boolean',
      hidden: ({ parent }) => !parent.played, // só mostra se o jogo ocorreu
      initialValue: true,
    },
    {
      name: 'attendance2',
      title: 'Jogador 2 compareceu?',
      type: 'boolean',
      hidden: ({ parent }) => !parent.played,
      initialValue: true,
    },
  ],
})
