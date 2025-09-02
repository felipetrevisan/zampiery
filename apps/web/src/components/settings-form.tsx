'use client'

import { SheetClose, SheetFooter } from '@nathy/shared/ui/animated/sheet'
import { Switch } from '@nathy/shared/ui/animated/switch'
import { ToggleGroup, ToggleGroupItem } from '@nathy/shared/ui/animated/toggle-group'
import { Button } from '@nathy/shared/ui/button'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { useApp } from '@nathy/web/hooks/use-app'
import { ThemeColor, ThemeColorLabels } from '@nathy/web/types/settings'
import { CheckIcon, LaptopIcon, Loader2Icon, MoonIcon, SunIcon, XIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface SettingsFormProps {
  onSubmit: () => void
}

export function SettingsForm({ onSubmit }: SettingsFormProps) {
  const { setTheme } = useTheme()
  const { setColor, setBackgroundEffect } = useApp()

  const {
    register,
    control,
    watch,
    formState: { isSubmitting, isValid },
  } = useFormContext()

  const themeColor = watch('theme.color')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (themeColor) setColor(themeColor)
  }, [themeColor])

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-10 grid gap-4 py-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="title" className="text-right">
            Titulo do App
          </Label>
          <Input {...register('title')} />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="theme-schema" className="text-right">
            Tema
          </Label>
          <Controller
            control={control}
            name="theme.schema"
            render={({ field }) => (
              <ToggleGroup
                type="single"
                aria-label="Theme"
                value={field.value ?? 'system'}
                onValueChange={(value) => {
                  if (!value) return
                  field.onChange(value)
                  setTheme(value)
                }}
              >
                <ToggleGroupItem
                  value="system"
                  aria-label="System"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                >
                  <LaptopIcon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  aria-label="Dark"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                >
                  <MoonIcon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="light"
                  aria-label="Light"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                >
                  <SunIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="theme-color" className="text-right">
            Cor
          </Label>
          <ComboboxField
            control={control}
            name="theme.color"
            options={Object.values(ThemeColor).map((color) => {
              return { value: color.toLocaleLowerCase(), label: ThemeColorLabels[color] }
            })}
            placeholder="Selecione um tema"
            returnType="string"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="theme-color" className="text-right">
            Usar Efeito de Fundo
          </Label>
          <Controller
            control={control}
            name="backgroundEffect"
            render={({ field }) => (
              <Switch
                name={field.name}
                checked={field.value ?? false}
                onCheckedChange={(value) => {
                  field.onChange(value)
                  setBackgroundEffect(value)
                }}
              />
            )}
          />
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            size="lg"
            className="w-full cursor-pointer rounded-full"
          >
            {isSubmitting ? <Loader2Icon /> : 'Salvar'}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  )
}
