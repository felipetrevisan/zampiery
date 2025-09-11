'use client'

import { Input, Label } from '@nathy/shared/ui'
import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nathy/shared/ui/animated/dialog'
import { Button } from '@nathy/shared/ui/button'
import { Calendar } from '@nathy/shared/ui/calendar'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Popover, PopoverContent, PopoverTrigger } from '@nathy/shared/ui/popover'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import { usePlayer } from '@nathy/web/hooks/use-player'
import type { GroupedList, PaginatedSingleGroupedList } from '@nathy/web/types/grouped-list'
import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface HeaderProps {
  onSubmit: () => void
  onDialogOpen: (state: boolean) => void
  dialogOpen: boolean
  data: PaginatedSingleGroupedList
}

export function Header({ onSubmit, onDialogOpen, dialogOpen, data }: HeaderProps) {
  const { data: players, isLoading } = usePlayer([])
  const [open, setOpen] = useState(false)

  const {
    register,
    control,
    formState: { isSubmitting, isValid },
  } = useFormContext()

  function handleSubmit() {
    onSubmit()
    onDialogOpen(false)
  }

  return (
    <BaseHeader showTotalCount={false} title={data.title}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={dialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                disabled={isSubmitting}
                onClick={() => {
                  onDialogOpen(true)
                }}
                rounded="2xl"
                size="lg"
                type="button"
              >
                Adicionar Novo Jogo
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Jogo</DialogTitle>
                <Separator className="h-6" orientation="horizontal" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-10">
                  <div className="grid gap-3">
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
                                className="w-48 justify-between font-normal"
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
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                      <Label>Jogador Casa</Label>
                      <ComboboxField
                        control={control}
                        disabled={isLoading || !players?.length}
                        name="player.home.player"
                        options={players?.map(({ id, name }) => {
                          return { value: id, label: name }
                        })}
                        placeholder="Selecione um jogador"
                        returnType="object"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Placar Casa</Label>
                      <Input
                        {...register('player.home.score', { valueAsNumber: true })}
                        disabled={isLoading || !players?.length}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                      <Label>Jogador Visitante</Label>
                      <ComboboxField
                        control={control}
                        disabled={isLoading || !players?.length}
                        name="player.guest.player"
                        options={players?.map(({ id, name }) => {
                          return { value: id, label: name }
                        })}
                        placeholder="Selecione um jogador"
                        returnType="object"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Placar Visitante</Label>
                      <Input
                        {...register('player.guest.score', { valueAsNumber: true })}
                        disabled={isLoading || !players?.length}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isSubmitting} variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button disabled={isSubmitting || !isValid} onClick={handleSubmit} type="submit">
                  {isSubmitting ? <Loader2Icon /> : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
