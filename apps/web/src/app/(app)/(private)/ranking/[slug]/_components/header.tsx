'use client'

import { Label, toast } from '@nathy/shared/ui'
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
import { HighlightText } from '@nathy/shared/ui/animated/text/highlight'
import { Button } from '@nathy/shared/ui/button'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import { usePlayer } from '@nathy/web/hooks/use-player'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  data: PaginatedSingleRanking
  totalPlayers: number
  onSubmit: () => void
}

export function Header({ data, totalPlayers, onSubmit }: HeaderProps) {
  const {
    control,
    formState: { isSubmitting, isValid },
  } = useFormContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogCopyOpen, setIsDialogCopyOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { data: players, isLoading: loadingPlayers } = usePlayer([])

  function handleSubmit() {
    onSubmit()
    setIsDialogOpen(false)
  }

  const names = data.data.map((person) => person.name)
  const formatted =
    names.length > 1
      ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
      : (names[0] ?? '')

  const copyNames = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(formatted)

    toast.success('Nomes copiado na área de transferencia')
  }

  const closeCopyDialog = () => {
    setIsCopied(false)
    setIsDialogCopyOpen(false)
  }

  return (
    <BaseHeader showTotalCount title={data.title} totalCount={totalPlayers ?? 0}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton disabled={isSubmitting} rounded="2xl" size="lg" type="button">
                Adicionar Pessoa
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Pessoa</DialogTitle>
                <Separator className="h-6" orientation="horizontal" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="type">Pessoa</Label>
                    <ComboboxField
                      control={control}
                      disabled={loadingPlayers || !players?.length}
                      name="person"
                      options={players?.map((player) => {
                        return { value: player.id, label: player.name }
                      })}
                      placeholder="Selecione uma pessoa"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isSubmitting} variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  disabled={isSubmitting || loadingPlayers || !players?.length || !isValid}
                  onClick={handleSubmit}
                  type="submit"
                >
                  {isSubmitting ? <Loader2Icon /> : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <Dialog onOpenChange={setIsDialogCopyOpen} open={isDialogCopyOpen}>
          <DialogTrigger asChild>
            <BlobButton disabled={!data.total} rounded="2xl" size="lg" type="button">
              Copiar
            </BlobButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Copiar Lista</DialogTitle>
              <Separator className="h-6" orientation="horizontal" />
            </DialogHeader>
            <div className="mt-5">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  {isCopied ? (
                    <HighlightText text={formatted} />
                  ) : (
                    <span className="text-xl">{formatted}</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={closeCopyDialog} variant="outline">
                  Fechar
                </Button>
              </DialogClose>
              <Button onClick={copyNames} variant="outline">
                Copiar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
