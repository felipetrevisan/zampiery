'use client'

import { CheckCheck } from '@nathy/shared/ui/animated/icons/check-check'
import { AnimateIcon } from '@nathy/shared/ui/animated/icons/icon'
import { LoaderPinwheel } from '@nathy/shared/ui/animated/icons/loader-pinwheel'
import { SheetClose, SheetFooter } from '@nathy/shared/ui/animated/sheet'
import { Switch } from '@nathy/shared/ui/animated/switch'
import { ToggleGroup, ToggleGroupItem } from '@nathy/shared/ui/animated/toggle-group'
import { Button } from '@nathy/shared/ui/button'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { useApp } from '@nathy/web/hooks/use-app'
import { ThemeColor, ThemeColorLabels, type ThemeColorType } from '@nathy/web/types/settings'
import { LaptopIcon, MoonIcon, StarIcon, SunIcon, WormIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { SettingsFormSchema } from '../config/schemas/settings'

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
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<SettingsFormSchema>()

  const themeColor = watch('theme.color')
  const showBackgroundEffect = watch('showBackgroundEffect')

  useEffect(() => {
    if (themeColor) {
      //setColor(themeColor as )
      document.body.dataset.theme = themeColor ?? 'default'
    }
  }, [themeColor])

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-10 grid gap-4 py-4">
        <div className="relative flex flex-col gap-4">
          <Label className="text-right">Titulo do App</Label>
          <Input
            {...register('title')}
            className={`peer ${errors.title ? 'border-red-500' : ''}`}
          />
          <AnimatePresence>
            {errors.title && (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: -10 }}
                key="title-error"
              >
                {errors.title.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          animate={{ marginTop: errors.title ? 60 : 0 }}
          className="flex flex-row items-center gap-4"
          exit={{ marginTop: 0 }}
          initial={{ marginTop: 0 }}
        >
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
        </motion.div>
        <div className="flex flex-row items-center gap-4">
          <Label className="text-right" htmlFor="theme-color">
            Cor
          </Label>
          <Controller
            control={control}
            name="theme.color"
            render={({ field }) => (
              <ToggleGroup
                aria-label="Theme"
                className="flex-wrap justify-start"
                onValueChange={(value) => {
                  if (!value) return
                  field.onChange(value)
                  setColor(value as ThemeColorType)
                }}
                type="single"
                value={field.value}
              >
                {Object.values(ThemeColor).map((color, index) => (
                  <ToggleGroupItem
                    aria-label={color}
                    className="rounded-full data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
                    // biome-ignore lint/suspicious/noArrayIndexKey: using index as key is acceptable here
                    key={index}
                    value={color}
                  >
                    {ThemeColorLabels[color]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
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
            className="w-full"
            disabled={isSubmitting || !isValid}
            onClick={onSubmit}
            size="lg"
            type="submit"
          >
            {isSubmitting ? (
              <AnimateIcon animateOnHover animation="path" loop>
                <LoaderPinwheel animate="path-loop" animation="path-loop" loop /> Salvando
              </AnimateIcon>
            ) : (
              <AnimateIcon animateOnHover animation="path">
                <CheckCheck animate="path-loop" animateOnHover animateOnTap animation="path-loop" />{' '}
                Salvar
              </AnimateIcon>
            )}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  )
}
