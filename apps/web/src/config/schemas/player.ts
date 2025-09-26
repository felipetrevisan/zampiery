import z from 'zod'

export const playerFormSchema = z.object({
  avatar: z.string().url().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  favoritePosition: z.string().optional(),
  favoriteTeam: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  isFavorite: z.boolean().default(false),
})

export type PlayerFormSchema = z.infer<typeof playerFormSchema>
