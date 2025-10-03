import z from 'zod'

export const formationFormSchema = z.object({
  formation: z.string().min(1, 'Selecione uma formação'),
})

export type FormationFormSchema = z.infer<typeof formationFormSchema>
