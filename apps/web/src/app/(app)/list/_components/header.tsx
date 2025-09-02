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
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Separator } from '@nathy/shared/ui/separator'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectList: (list: GroupedList | null) => void
  onDialogOpen: (state: boolean) => void
  selectedList: GroupedList | null
  dialogOpen: boolean
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectList,
  dialogOpen,
  selectedList,
}: HeaderProps) {
  const {
    register,
    control,
    reset,
    formState: { isSubmitting, isValid },
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
      <h2 className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tight">Listas</h2>

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
