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
import type { RankingListFormSchema } from '@nathy/web/config/schemas/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { AnimatePresence, motion } from 'motion/react'
import { useFormContext } from 'react-hook-form'

const MotionDialogFooter = motion(DialogFooter)

interface AddRankingDialogProps {
  onSubmit: () => void
  selectedList: Ranking | null
}

export function AddRankingDialog({ selectedList, onSubmit }: AddRankingDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<RankingListFormSchema>()

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle> {selectedList ? 'Editar Lista' : 'Adicionar Nova Lista'}</DialogTitle>
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
                  key="title-error"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Separator className="h-6" orientation="horizontal" />
      <MotionDialogFooter
        animate={{ marginTop: errors.title ? 60 : 0 }}
        className="flex flex-col gap-3"
        exit={{ marginTop: 0 }}
        initial={{ marginTop: 0 }}
      >
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
      </MotionDialogFooter>
    </DialogContent>
  )
}
