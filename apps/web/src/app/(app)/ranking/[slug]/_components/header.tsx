'use client'

import { Label } from '@nathy/shared/ui'
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
import { CountingNumber } from '@nathy/shared/ui/animated/text/counting-number'
import { Button } from '@nathy/shared/ui/button'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Separator } from '@nathy/shared/ui/separator'
import { usePlayer } from '@nathy/web/hooks/use-player'
import type { Ranking } from '@nathy/web/types/ranking'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  data: Ranking
  onSubmit: () => void
}

export function Header({ data, onSubmit }: HeaderProps) {
  const {
    control,
    formState: { isSubmitting, isValid },
  } = useFormContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: players, isLoading: loadingPlayers } = usePlayer()

  function handleSubmit() {
    onSubmit()
    setIsDialogOpen(false)
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tight">
        {data.title}
        <CountingNumber
          className='w-[50px] rounded-full border-1 border-primary/30 p-2 text-center text-primary shadow-md shadow-primary/10'
          number={data?.players.length ?? 0}
          fromNumber={0}
        />
      </h2>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton type="button" size="lg" rounded="2xl" disabled={isSubmitting}>
                Adicionar Pessoa
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Pessoa</DialogTitle>
                <Separator orientation="horizontal" className="h-6" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="type">Pessoa</Label>
                    <ComboboxField
                      control={control}
                      name="person"
                      options={players?.map((player) => {
                        return { value: player.id, label: player.name }
                      })}
                      placeholder="Selecione uma pessoa"
                      disabled={loadingPlayers || !players?.length}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || loadingPlayers || !players?.length || !isValid}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? <Loader2Icon /> : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  )
}
