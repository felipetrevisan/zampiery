import { themeColorKeys } from '@nathy/web/types/settings'
import z from 'zod'

export const settingsFormSchema = z
  .object({
    title: z.string().min(1, 'Título do App é obrigatório').default('Nathy Zampiery'),
    theme: z.object({
      schema: z.enum(['light', 'dark', 'system']).default('system'),
      color: z.enum(themeColorKeys as [string, ...string[]]).default('default'),
    }),
    showBackgroundEffect: z.coerce.boolean().default(true),
    backgroundEffectType: z.enum(['hole', 'stars']).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.showBackgroundEffect && !data.backgroundEffectType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['backgroundEffectType'],
        message: 'O tipo de efeito de fundo é obrigatório quando o efeito está ativado',
      })
    }
  })

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>
