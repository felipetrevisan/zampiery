'use client'

import { cn } from '@nathy/shared/lib/utils'
import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { PlusCircleIcon } from 'lucide-react'

type GameAddButtonProps = {
  onAddGame: () => void
}

export function GameAddButton({ onAddGame }: GameAddButtonProps) {
  return (
    <BlobButton className="flex cursor-pointer items-center justify-center gap-4" rounded="full">
      <div className="flex w-full items-center justify-between space-x-2 p-4">
        <PlusCircleIcon className="font-russo text-2xl" onClick={onAddGame} />
      </div>
    </BlobButton>
  )
}
