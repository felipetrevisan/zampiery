'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { Dialog, DialogTrigger } from '@nathy/shared/ui/animated/dialog'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { RankingListFormSchema } from '@nathy/web/config/schemas/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddRankingDialog } from './add-ranking-dialog'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectList: (list: Ranking | null) => void
  onDialogOpen: (state: boolean) => void
  selectedList: Ranking | null
  isDialogOpen: boolean
  rankingListTotalCount: number
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectList,
  isDialogOpen,
  selectedList,
  rankingListTotalCount = 0,
}: HeaderProps) {
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext<RankingListFormSchema>()

  function handleSubmit() {
    if (selectedList) {
      onEdit()
    } else {
      onSubmit()
    }

    onDialogOpen(false)
  }

  useEffect(() => {
    if (!isDialogOpen) {
      reset()
    }

    if (selectedList) {
      reset({
        title: selectedList.title,
      })
    } else {
      reset({
        title: '',
      })
    }
  }, [selectedList, isDialogOpen, reset])

  return (
    <BaseHeader showTotalCount title="Listas de Ranking" totalCount={rankingListTotalCount}>
      <div className="flex items-center gap-2">
        <Dialog onOpenChange={onDialogOpen} open={isDialogOpen}>
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
            <AddRankingDialog onSubmit={handleSubmit} selectedList={selectedList} />
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
