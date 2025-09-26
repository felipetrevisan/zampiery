import z from 'zod'

export const gameFormSchema = z.object({
  date: z.date({ message: 'Selecione uma data' }),
  player: z.object({
    home: z.object({
      player: z.object({
        id: z.string().min(1, 'O jogador da casa é obrigatório'),
        name: z.string().min(1, 'O jogador da casa é obrigatório'),
      }),
      score: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined
        const num = Number(val)
        return Number.isNaN(num) ? undefined : num
      }, z
        .number({ message: 'O placar deve ser um número' })
        .min(0, { message: 'O placar não pode ser negativo' })
        .finite()
        .optional()),
    }),
    guest: z.object({
      player: z.object({
        id: z.string().min(1, 'O jogador visitante é obrigatório'),
        name: z.string().min(1, 'O jogador visitante é obrigatório'),
      }),
      score: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined
        const num = Number(val)
        return Number.isNaN(num) ? undefined : num
      }, z
        .number({ message: 'O placar deve ser um número' })
        .min(0, { message: 'O placar não pode ser negativo' })
        .finite()
        .optional()),
    }),
  }),
})

export type GameFormSchema = z.infer<typeof gameFormSchema>
