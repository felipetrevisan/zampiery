import z from 'zod'

export const listFormSchema = z.object({
  title: z.string().min(1, 'Título da lista é obrigatório'),
})

export type ListFormSchema = z.infer<typeof listFormSchema>
