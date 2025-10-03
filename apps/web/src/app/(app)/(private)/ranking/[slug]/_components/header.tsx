'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { Dialog, DialogTrigger } from '@nathy/shared/ui/animated/dialog'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { Copy } from '@nathy/shared/ui/animated/icons/copy'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { PersonFormSchema } from '@nathy/web/config/schemas/ranking'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddPlayerToRankingDialog } from './add-player-dialog'
import { CopyPlayerDialog } from './copy-player-dialog'

interface HeaderProps {
  data: PaginatedSingleRanking
  onDialogOpen: (state: boolean) => void
  isDialogOpen: boolean
  totalPlayers: number
  onSubmit: () => void
}

export function Header({ data, totalPlayers, onDialogOpen, isDialogOpen, onSubmit }: HeaderProps) {
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext<PersonFormSchema>()
  const [isDialogCopyOpen, setIsDialogCopyOpen] = useState(false)

  function handleSubmit() {
    onSubmit()
    onDialogOpen(false)
  }

  useEffect(() => {
    if (!isDialogOpen) {
      reset()
    }
  }, [isDialogOpen, reset])

  const closeCopyDialog = () => {
    setIsDialogCopyOpen(false)
  }

  return (
    <BaseHeader showTotalCount title={data.title} totalCount={totalPlayers ?? 0}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={isDialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton disabled={isSubmitting} rounded="2xl" size="lg" type="button">
                <CirclePlus animate="path-loop" animateOnHover animateOnTap />
                <span className="hidden md:block">Adicionar Pessoa</span>
              </BlobButton>
            </DialogTrigger>
            <AddPlayerToRankingDialog onSubmit={handleSubmit} />
          </form>
        </Dialog>

        <Dialog onOpenChange={setIsDialogCopyOpen} open={isDialogCopyOpen}>
          <DialogTrigger asChild>
            <BlobButton disabled={!data.total} rounded="2xl" size="lg" type="button">
              <Copy animate="path-loop" animateOnHover animateOnTap />
              <span className="hidden md:block">Copiar</span>
            </BlobButton>
          </DialogTrigger>
          <CopyPlayerDialog onClose={closeCopyDialog} players={data.data} />
        </Dialog>
      </div>
    </BaseHeader>
  )
}
