import z from 'zod'

export const updateUserProfileForm = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  currentPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type UpdateUserProfileFormSchema = z.infer<typeof updateUserProfileForm>

export const updateUserPasswordProfileForm = z
  .object({
    currentPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    newPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmNewPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        path: ['confirmNewPassword'],
        code: 'custom',
        message: 'As senhas não conferem',
      })
    }
  })

export type UpdateUserPasswordProfileFormSchema = z.infer<typeof updateUserPasswordProfileForm>
