'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { GroupedList } from '@nathy/web/types/grouped-list'

interface HeaderProps {
  onDialogOpen: (state: boolean) => void
  data: GroupedList
}

export function Header({ onDialogOpen, data }: HeaderProps) {
  return (
    <BaseHeader showTotalCount={false} title={data.title}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <BlobButton
          onClick={() => {
            onDialogOpen(true)
          }}
          rounded="2xl"
          size="lg"
          type="button"
        >
          <CirclePlus animate="path-loop" animateOnHover animateOnTap />
          <span className="hidden md:block">Adicionar Novo Jogo</span>
        </BlobButton>
      </div>
    </BaseHeader>
  )
}
