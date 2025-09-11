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
import { LaptopIcon, Loader2Icon, MoonIcon, StarIcon, SunIcon, WormIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface SettingsFormProps {
  onSubmit: () => void
}

export function SettingsForm({ onSubmit }: SettingsFormProps) {
  const { setTheme } = useTheme()
  const { setColor, setShowBackgroundEffect, setBackgroundEffectType } = useApp()

  const {
    register,
    control,
    watch,
    formState: { isSubmitting, isValid },
  } = useFormContext()

  const themeColor = watch('theme.color')
  const showBackgroundEffect = watch('showBackgroundEffect')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (themeColor) setColor(themeColor)
  }, [themeColor])

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-10 grid gap-4 py-4">
        <div className="flex flex-col gap-4">
          <Label className="text-right" htmlFor="title">
            Titulo do App
          </Label>
          <Input {...register('title')} />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label className="text-right" htmlFor="theme-schema">
            Tema
          </Label>
          <Controller
            control={control}
            name="theme.schema"
            render={({ field }) => (
              <ToggleGroup
                aria-label="Theme"
                onValueChange={(value) => {
                  if (!value) return
                  field.onChange(value)
                  setTheme(value)
                }}
                type="single"
                value={field.value ?? 'system'}
              >
                <ToggleGroupItem
                  aria-label="System"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                  value="system"
                >
                  <LaptopIcon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  aria-label="Dark"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                  value="dark"
                >
                  <MoonIcon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  aria-label="Light"
                  className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                  value="light"
                >
                  <SunIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label className="text-right" htmlFor="theme-color">
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
          <Label className="text-right" htmlFor="theme-color">
            Usar Efeito de Fundo?
          </Label>
          <Controller
            control={control}
            name="showBackgroundEffect"
            render={({ field }) => (
              <Switch
                checked={field.value ?? false}
                name={field.name}
                onCheckedChange={(value) => {
                  field.onChange(value)
                  setShowBackgroundEffect(value)
                }}
              />
            )}
          />
        </div>
        {showBackgroundEffect && (
          <div className="flex flex-row items-center gap-4">
            <Label className="text-right" htmlFor="theme-schema">
              Tipo de Efeito de Fundo
            </Label>
            <Controller
              control={control}
              name="backgroundEffectType"
              render={({ field }) => (
                <ToggleGroup
                  aria-label="Background Effect"
                  onValueChange={(value) => {
                    if (!value) return
                    field.onChange(value)
                    setBackgroundEffectType(value)
                  }}
                  type="single"
                  value={field.value ?? 'hole'}
                >
                  <ToggleGroupItem
                    aria-label="Hole"
                    className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                    value="hole"
                  >
                    <WormIcon />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    aria-label="Stars"
                    className="data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                    value="stars"
                  >
                    <StarIcon />
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </div>
        )}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            className="w-full cursor-pointer rounded-full"
            disabled={isSubmitting || !isValid}
            size="lg"
            type="submit"
          >
            {isSubmitting ? <Loader2Icon /> : 'Salvar'}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  )
}
