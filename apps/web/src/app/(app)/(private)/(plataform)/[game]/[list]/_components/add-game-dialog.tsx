import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nathy/shared/ui/animated/dialog'
import { Button } from '@nathy/shared/ui/button'
import { Calendar } from '@nathy/shared/ui/calendar'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@nathy/shared/ui/popover'
import { Separator } from '@nathy/shared/ui/separator'
import type { GameFormSchema } from '@nathy/web/config/schemas/game'
import { usePlayer } from '@nathy/web/hooks/use-player'
import { format } from 'date-fns'
import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface AddGameDialogProps {
  onSubmit: () => void
  onDialogOpen: (state: boolean) => void
  dialogOpen: boolean
  selectedDate: string | null
}

const MotionDialogFooter = motion(DialogFooter)

export function AddGameDialog({
  onDialogOpen,
  dialogOpen,
  selectedDate,
  onSubmit,
}: AddGameDialogProps) {
  const { data: players, isLoading } = usePlayer([])
  const [open, setOpen] = useState(false)

  const {
    register,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useFormContext<GameFormSchema>()

  function handleSubmit() {
    onSubmit()
    onDialogOpen(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!selectedDate) setValue('date', new Date())
    if (selectedDate) setValue('date', new Date(selectedDate), { shouldValidate: true })
  }, [selectedDate])

  useEffect(() => {
    if (!dialogOpen) {
      reset()
    }
  }, [dialogOpen, reset])

  return (
    <Dialog onOpenChange={onDialogOpen} open={dialogOpen}>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Adicionar Jogo{' '}
              {selectedDate ? ` no dia ${format(new Date(selectedDate), 'dd/MM/yyy')}` : null}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-5">
            <div className="grid gap-10">
              <div className="relative grid gap-3">
                <Label className="px-1" htmlFor="date">
                  Data do Jogo
                </Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => {
                    const valueAsDate =
                      field.value instanceof Date
                        ? field.value
                        : field.value
                          ? new Date(field.value)
                          : undefined

                    return (
                      <Popover modal onOpenChange={setOpen} open={open}>
                        <PopoverTrigger asChild>
                          <Button
                            className={`peer h-12 w-[200px] justify-between font-normal ${errors.date ? 'border-red-500' : ''}`}
                            id="date"
                            variant="outline"
                          >
                            {valueAsDate
                              ? valueAsDate.toLocaleDateString('pt-BR')
                              : 'Selecione uma data'}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
                          <Calendar
                            captionLayout="dropdown"
                            disabled={{ after: new Date() }}
                            mode="single"
                            onSelect={(date) => {
                              field.onChange(date ?? null)
                              setOpen(false)
                            }}
                            required
                            selected={valueAsDate}
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                />
                <AnimatePresence>
                  {errors.date && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: -10 }}
                      key="date-error"
                    >
                      {errors.date.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                animate={{ marginTop: errors.date ? 60 : 0 }}
                className="relative grid grid-cols-3 gap-x-10"
                exit={{ marginTop: 0 }}
                initial={{ marginTop: 0 }}
              >
                <div className="relative col-span-2 flex flex-col gap-3">
                  <Label>Jogador Casa</Label>
                  <ComboboxField
                    className={`peer w-full ${errors.player?.home?.player ? 'border-red-500' : ''}`}
                    control={control}
                    disabled={isLoading || !players?.length}
                    name="player.home.player"
                    options={players?.map(({ id, name }) => {
                      return { value: id, label: name }
                    })}
                    placeholder="Selecione um jogador"
                    returnType="object"
                  />
                  <AnimatePresence>
                    {errors.player?.home?.player?.id && (
                      <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        key="home-name-error"
                      >
                        {errors.player?.home?.player.id.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Placar Casa</Label>
                  <Input
                    {...register('player.home.score', { valueAsNumber: true })}
                    className={`peer ${errors.player?.home?.score ? 'border-red-500' : ''}`}
                    disabled={isLoading || !players?.length}
                  />
                  <AnimatePresence>
                    {errors.player?.home?.score && (
                      <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        key="home-score-error"
                      >
                        {errors.player?.home?.score.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              <motion.div
                animate={{ marginTop: errors.player?.home ? 60 : 0 }}
                className="relative grid grid-cols-3 gap-x-10"
                exit={{ marginTop: 0 }}
                initial={{ marginTop: 0 }}
              >
                <div className="relative col-span-2 flex flex-col gap-3">
                  <Label>Jogador Visitante</Label>
                  <ComboboxField
                    className={`peer w-full ${errors.player?.guest?.player ? 'border-red-500' : ''}`}
                    control={control}
                    disabled={isLoading || !players?.length}
                    name="player.guest.player"
                    options={players?.map(({ id, name }) => {
                      return { value: id, label: name }
                    })}
                    placeholder="Selecione um jogador"
                    returnType="object"
                  />
                  <AnimatePresence>
                    {errors.player?.guest?.player && (
                      <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        key="guest-name-error"
                      >
                        {errors.player?.guest?.player.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Placar Visitante</Label>
                  <Input
                    {...register('player.guest.score', { valueAsNumber: true })}
                    className={`peer ${errors.player?.guest?.player ? 'border-red-500' : ''}`}
                    disabled={isLoading || !players?.length}
                  />
                  <AnimatePresence>
                    {errors.player?.guest?.score && (
                      <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        key="guest-score-error"
                      >
                        {errors.player?.guest?.score.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
          <Separator className="h-6" orientation="horizontal" />

          <MotionDialogFooter
            animate={{ marginTop: errors.player?.guest ? 60 : 0 }}
            className="relative"
            exit={{ marginTop: 0 }}
            initial={{ marginTop: 0 }}
          >
            <DialogClose asChild>
              <Button disabled={isSubmitting} size="lg" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isSubmitting || !isValid}
              onClick={handleSubmit}
              size="lg"
              type="submit"
            >
              {isSubmitting ? <Loader2Icon /> : 'Salvar'}
            </Button>
          </MotionDialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
