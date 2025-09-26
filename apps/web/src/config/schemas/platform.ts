import z from 'zod'

export const platformFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

export type PlatformFormSchema = z.infer<typeof platformFormSchema>
