import z from 'zod'

export const rankingListFormSchema = z.object({
  title: z.string().min(1, 'Título da lista é obrigatório'),
})

export type RankingListFormSchema = z.infer<typeof rankingListFormSchema>

export const personFormSchema = z.object({
  person: z.object({
    id: z.string().min(1, 'Nome é obrigatório'),
    name: z.string().min(1),
  }),
})

export type PersonFormSchema = z.infer<typeof personFormSchema>
