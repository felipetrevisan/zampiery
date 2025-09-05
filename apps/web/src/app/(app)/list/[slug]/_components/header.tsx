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
import { usePlayer } from '@nathy/web/hooks/use-player'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface HeaderProps {
  onSubmit: () => void
  onDialogOpen: (state: boolean) => void
  dialogOpen: boolean
  list: GroupedList
}

export function Header({ onSubmit, onDialogOpen, dialogOpen, list }: HeaderProps) {
  const { data, isLoading } = usePlayer([])
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
    <div className="mb-20 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tight">{list.title}</h2>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />

        <Dialog open={dialogOpen} onOpenChange={onDialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                type="button"
                size="lg"
                disabled={isSubmitting}
                rounded="2xl"
                onClick={() => {
                  onDialogOpen(true)
                }}
              >
                Adicionar Novo Jogo
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Jogo</DialogTitle>
                <Separator orientation="horizontal" className="h-6" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-10">
                  <div className="grid gap-3">
                    <Label htmlFor="date" className="px-1">
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
                          <Popover open={open} onOpenChange={setOpen} modal>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                              >
                                {valueAsDate
                                  ? valueAsDate.toLocaleDateString('pt-BR')
                                  : 'Selecione uma data'}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={valueAsDate}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  field.onChange(date ?? null)
                                  setOpen(false)
                                }}
                                required
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
                        name="player.home.player"
                        options={data?.map(({ id, name }) => {
                          return { value: id, label: name }
                        })}
                        placeholder="Selecione um jogador"
                        disabled={isLoading || !data?.length}
                        returnType="object"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Placar Casa</Label>
                      <Input
                        {...register('player.home.score', { valueAsNumber: true })}
                        disabled={isLoading || !data?.length}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                      <Label>Jogador Visitante</Label>
                      <ComboboxField
                        control={control}
                        name="player.guest.player"
                        options={data?.map(({ id, name }) => {
                          return { value: id, label: name }
                        })}
                        placeholder="Selecione um jogador"
                        disabled={isLoading || !data?.length}
                        returnType="object"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Placar Visitante</Label>
                      <Input
                        {...register('player.guest.score', { valueAsNumber: true })}
                        disabled={isLoading || !data?.length}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting || !isValid} onClick={handleSubmit}>
                  {isSubmitting ? <Loader2Icon /> : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  )
}
