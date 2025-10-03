'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { Dialog, DialogTrigger } from '@nathy/shared/ui/animated/dialog'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { ListFormSchema } from '@nathy/web/config/schemas/grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import type { Platform } from '@nathy/web/types/platform'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddListDialog } from './add-list-dialog'

interface HeaderProps {
  data: Platform
  onSubmit: () => void
  onEdit: () => void
  onSelectList: (list: GroupedList | null) => void
  onDialogOpen: (state: boolean) => void
  selectedList: GroupedList | null
  groupedListTotalCount: number
  dialogOpen: boolean
}

export function Header({
  data,
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectList,
  dialogOpen,
  selectedList,
  groupedListTotalCount = 0,
}: HeaderProps) {
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext<ListFormSchema>()

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
    <BaseHeader showTotalCount title={data.title} totalCount={groupedListTotalCount}>
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
                <CirclePlus animate="path-loop" animateOnHover animateOnTap />
                <span className="hidden md:block">Adicionar Nova Lista</span>
              </BlobButton>
            </DialogTrigger>
            <AddListDialog onSubmit={handleSubmit} platform={data} selectedList={selectedList} />
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
