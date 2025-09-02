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
import { CountingNumber } from '@nathy/shared/ui/animated/text/counting-number'
import { Button } from '@nathy/shared/ui/button'
import { Separator } from '@nathy/shared/ui/separator'
import type { Ranking } from '@nathy/web/types/ranking'
import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectList: (list: Ranking | null) => void
  onDialogOpen: (state: boolean) => void
  selectedList: Ranking | null
  dialogOpen: boolean
  rankingLists: Ranking[]
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectList,
  dialogOpen,
  selectedList,
  rankingLists
}: HeaderProps) {
  const {
    register,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useFormContext()

  function handleSubmit() {
    if (selectedList) {
      onEdit()
    } else {
      onSubmit()
    }

    onDialogOpen(false)
  }

  useEffect(() => {
    if (selectedList) {
      reset({
        title: selectedList.title,
      })
    } else {
      reset({
        title: '',
      })
    }
  }, [selectedList, reset])

  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tight">
        Listas de Ranking
        <CountingNumber
          className="w-[50px] rounded-full border-1 border-primary/30 p-2 text-center text-primary shadow-md shadow-primary/10"
          number={rankingLists?.length ?? 0}
          fromNumber={0}
        />
      </h2>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />

        <Dialog open={dialogOpen} onOpenChange={onDialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                type="button"
                size="lg"
                rounded="2xl"
                disabled={isSubmitting}
                onClick={() => {
                  onSelectList(null)
                  onDialogOpen(true)
                }}
              >
                Adicionar Nova Lista
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle> {selectedList ? 'Editar Lista' : 'Adicionar Nova Lista'}</DialogTitle>
                <Separator orientation="horizontal" className="h-6" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Título</Label>
                    <Input {...register('title')} />
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
