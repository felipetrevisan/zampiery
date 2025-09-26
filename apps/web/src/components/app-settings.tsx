'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SheetContent, SheetHeader, SheetTitle } from '@nathy/shared/ui/animated/sheet'
import { useMutationUpdateSettings } from '@nathy/web/hooks/mutations/settings'
import type { Settings, ThemeColor } from '@nathy/web/types/settings'
import { useQueryClient } from '@tanstack/react-query'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { type SettingsFormSchema, settingsFormSchema } from '../config/schemas/settings'
import { useSettings } from '../hooks/use-settings'
import { SettingsForm } from './settings-form'

interface AppSettingsSheetProps {
  side: 'right' | 'left' | 'top' | 'bottom'
  onSettingsOpen: Dispatch<SetStateAction<boolean>>
  isSettingsOpen: boolean
}

export function AppSettingsSheet({ side, isSettingsOpen }: AppSettingsSheetProps) {
  const queryClient = useQueryClient()
  const { data: currentSettings } = useSettings()

  const settingsform = useForm<SettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      title: currentSettings?.title ?? 'Nathy Zampiery',
      theme: {
        schema: currentSettings?.theme.schema ?? 'system',
        color: currentSettings?.theme.color ?? 'default',
      },
      showBackgroundEffect: currentSettings?.showBackgroundEffect ?? true,
      backgroundEffectType: currentSettings?.backgroundEffectType,
    },
    mode: 'all',
  })

  const { handleSubmit, setValue, reset } = settingsform

  useEffect(() => {
    if (!isSettingsOpen) {
      reset()
    }
  }, [isSettingsOpen, reset])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (currentSettings) {
      setValue('title', currentSettings.title)
      setValue('theme.schema', currentSettings.theme.schema)
      setValue('theme.color', currentSettings.theme.color)
      setValue('showBackgroundEffect', currentSettings.showBackgroundEffect)
      setValue('backgroundEffectType', currentSettings.backgroundEffectType)
    }
  }, [currentSettings])

  const { mutateAsync: updateSettings } = useMutationUpdateSettings(queryClient)

  async function handleUpdateSettings(data: SettingsFormSchema) {
    const settings: Settings = {
      title: data.title,
      theme: {
        schema: data.theme.schema,
        color: data.theme.color as keyof typeof ThemeColor,
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
