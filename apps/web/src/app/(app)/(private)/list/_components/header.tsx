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
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
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
  groupedListTotalCount: number
  dialogOpen: boolean
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectList,
  dialogOpen,
  selectedList,
  groupedListTotalCount = 0,
}: HeaderProps) {
  const {
    register,
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
    <BaseHeader showTotalCount title="Listas" totalCount={groupedListTotalCount}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={dialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                disabled={isSubmitting}
                onClick={() => {
                  onSelectList(null)
                  onDialogOpen(true)
                }}
                rounded="2xl"
                size="lg"
                type="button"
              >
                Adicionar Nova Lista
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle> {selectedList ? 'Editar Lista' : 'Adicionar Nova Lista'}</DialogTitle>
                <Separator className="h-6" orientation="horizontal" />
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
