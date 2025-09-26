'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { Dialog, DialogTrigger } from '@nathy/shared/ui/animated/dialog'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { PlatformFormSchema } from '@nathy/web/config/schemas/platform'
import type { Platform } from '@nathy/web/types/platform'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddPlatformDialog } from './add-platform-dialog'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectPlatform: (platform: Platform | null) => void
  onDialogOpen: Dispatch<SetStateAction<boolean>>
  selectedPlatform: Platform | null
  isDialogOpen: boolean
  platformsTotalCount: number
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectPlatform,
  isDialogOpen,
  selectedPlatform,
  platformsTotalCount = 0,
}: HeaderProps) {
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext<PlatformFormSchema>()

  function handleSubmit() {
    if (selectedPlatform) {
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

    if (selectedPlatform) {
      reset({
        title: selectedPlatform.title,
      })
    } else {
      reset({
        title: '',
      })
    }
  }, [selectedPlatform, isDialogOpen, reset])

  return (
    <BaseHeader showTotalCount title="Plataformas" totalCount={platformsTotalCount}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={isDialogOpen}>
          <form onSubmit={handleSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                disabled={isSubmitting}
                onClick={() => {
                  onSelectPlatform(null)
                  onDialogOpen(true)
                }}
                rounded="2xl"
                size="lg"
                type="button"
              >
                <CirclePlus animate="path-loop" animateOnHover animateOnTap />
                Adicionar Nova Plataforma
              </BlobButton>
            </DialogTrigger>
            <AddPlatformDialog onSubmit={handleSubmit} selectedPlatform={selectedPlatform} />
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
