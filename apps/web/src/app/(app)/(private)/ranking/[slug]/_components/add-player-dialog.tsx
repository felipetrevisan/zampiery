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
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Label } from '@nathy/shared/ui/label'
import { Separator } from '@nathy/shared/ui/separator'
import type { PersonFormSchema } from '@nathy/web/config/schemas/ranking'
import { usePlayer } from '@nathy/web/hooks/use-player'
import { AnimatePresence, motion } from 'motion/react'
import { useFormContext } from 'react-hook-form'

interface AddPlayerToRankingDialogProps {
  onSubmit: () => void
}

export function AddPlayerToRankingDialog({ onSubmit }: AddPlayerToRankingDialogProps) {
  const {
    control,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<PersonFormSchema>()
  const { data: players, isLoading: loadingPlayers } = usePlayer([])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Nova Pessoa</DialogTitle>
        <Separator className="h-6" orientation="horizontal" />
      </DialogHeader>
      <div className="mt-5">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="type">Pessoa</Label>
            <ComboboxField
              className={`peer ${errors.person ? 'border-red-500' : ''}`}
              control={control}
              disabled={loadingPlayers || !players?.length}
              name="person"
              options={players?.map((player) => {
                return { value: player.id, label: player.name }
              })}
              placeholder="Selecione uma pessoa"
            />
            <AnimatePresence>
              {errors.person?.id && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="person-error"
                >
                  {errors.person.id?.message}
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
        <Button
          disabled={isSubmitting || loadingPlayers || !players?.length || !isValid}
          onClick={onSubmit}
          type="submit"
        >
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
