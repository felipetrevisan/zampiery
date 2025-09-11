'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SheetContent, SheetHeader, SheetTitle } from '@nathy/shared/ui/animated/sheet'
import { useMutationUpdateSettings } from '@nathy/web/hooks/mutations/settings'
import type { Settings, ThemeColor } from '@nathy/web/types/settings'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'
import { useSettings } from '../hooks/use-settings'
import { SettingsForm } from './settings-form'

interface AppSettingsSheetProps {
  side: 'right' | 'left' | 'top' | 'bottom'
}

const themeColorKeys = [
  'default',
  'blue',
  'green',
  'amber',
  'purple',
  'rose',
  'orange',
  'teal',
] as const

const settingsFormSchema = z
  .object({
    title: z.string().min(1, 'Título do App é obrigatório').default('Nathy Zampiery'),
    theme: z.object({
      schema: z.enum(['light', 'dark', 'system']).default('system'),
      color: z.enum(themeColorKeys).default('default'),
    }),
    showBackgroundEffect: z.coerce.boolean().default(true),
    backgroundEffectType: z.enum(['hole', 'stars']).default('hole').optional(),
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

export function AppSettingsSheet({ side }: AppSettingsSheetProps) {
  const queryClient = useQueryClient()
  const { data: currentSettings } = useSettings()

  const settingsform = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      title: currentSettings?.title ?? 'Nathy Zampiery',
      theme: {
        schema: currentSettings?.theme.schema ?? 'system',
        color: (currentSettings?.theme.color as keyof typeof ThemeColor) ?? 'default',
      },
      showBackgroundEffect: currentSettings?.showBackgroundEffect ?? true,
      backgroundEffectType: currentSettings?.backgroundEffectType,
    },
    mode: 'onChange',
  })

  const { handleSubmit, setValue } = settingsform

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentSettings) {
      setValue('title', currentSettings.title)
      setValue('theme.schema', currentSettings.theme.schema)
      setValue('theme.color', currentSettings.theme.color)
    }
  }, [currentSettings])

  const { mutateAsync: updateSettings } = useMutationUpdateSettings(queryClient)

  async function handleUpdateSettings(data: SettingsFormSchema) {
    const settings: Settings = {
      title: data.title,
      theme: {
        schema: data.theme.schema,
        color: data.theme.color,
      },
      showBackgroundEffect: data.showBackgroundEffect,
      backgroundEffectType: data.backgroundEffectType ?? 'hole',
    }
    await updateSettings(settings)
  }

  return (
    <FormProvider {...settingsform}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Configurações</SheetTitle>
        </SheetHeader>
        <SettingsForm onSubmit={handleSubmit(handleUpdateSettings)} />
      </SheetContent>
    </FormProvider>
  )
}
