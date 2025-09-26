import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nathy/shared/ui/animated/dialog'
import { CheckCheck } from '@nathy/shared/ui/animated/icons/check-check'
import { LoaderPinwheel } from '@nathy/shared/ui/animated/icons/loader-pinwheel'
import { Button } from '@nathy/shared/ui/button'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { Separator } from '@nathy/shared/ui/separator'
import type { PlatformFormSchema } from '@nathy/web/config/schemas/platform'
import type { Platform } from '@nathy/web/types/platform'
import { AnimatePresence, motion } from 'motion/react'
import { useFormContext } from 'react-hook-form'

interface AddPlatformDialogProps {
  onSubmit: () => void
  selectedPlatform: Platform | null
}

export function AddPlatformDialog({ onSubmit, selectedPlatform }: AddPlatformDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<PlatformFormSchema>()

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {selectedPlatform ? 'Editar Plataforma' : 'Adicionar Nova Plataforma'}
        </DialogTitle>
        <Separator className="h-6" orientation="horizontal" />
      </DialogHeader>
      <div className="mt-5">
        <div className="grid gap-4">
          <div className="relative grid gap-3">
            <Label>Título</Label>
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
                  key="name-error"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Separator className="h-6" orientation="horizontal" />
      <DialogFooter>
        <DialogClose asChild>
          <Button disabled={isSubmitting} variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button disabled={isSubmitting || !isValid} onClick={onSubmit} type="submit">
          {isSubmitting ? (
            <LoaderPinwheel animate="path-loop" />
          ) : (
            <>
              <CheckCheck animate="path-loop" animateOnHover animateOnTap /> Salvar
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
