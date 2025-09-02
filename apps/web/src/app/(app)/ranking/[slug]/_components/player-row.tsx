'use client'

import { cn } from '@nathy/shared/lib/utils'
import { Toolbar } from '@nathy/web/components/toolbar'
import type { Player } from '@nathy/web/types/player'
import { formatOrdinals } from '@nathy/web/utils/number'
import { Trash } from 'lucide-react'

interface RowProps {
  onDelete: (id: string) => void
  player: Player
  index: number
}

export function PlayerRow({ player, index, onDelete }: RowProps) {
  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 w-1/5',
          'bg-gradient-to-r from-transparent',
          index === 0 && 'to-yellow-600 dark:to-yellow-400/20',
          index === 1 && 'to-gray-300/40',
          index === 2 && 'to-orange-400/40',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 flex w-1/5 items-center',
          'bg-gradient-to-r to-transparent',
          index === 0 && 'from-yellow-600/20 dark:from-yellow-400/20',
          index === 1 && 'from-gray-300/20',
          index === 2 && 'from-orange-400/20',
        )}
      >
        <span className='relative z-10 px-4 font-extrabold font-russo text-5xl text-primary group-hover:text-primary-foreground dark:text-foreground'>
          {formatOrdinals(index + 1)}
        </span>
      </div>
      <div className="flex items-center justify-between space-x-4 px-20 py-4">
        <div className='w-[300px] flex-1 font-bold text-lg text-primary group-hover:text-primary-foreground dark:text-foreground'>
          {player.name}
        </div>
      </div>
      <Toolbar<Player>
        context={player}
        buttons={[
          {
            icon: Trash,
            label: 'Deletar Pessoa',
            ariaLabel: 'delete person',
            className: 'bg-destructive text-destructive-foreground font-bold',
            onClick: (player) => onDelete(player.id),
          },
        ]}
      />
    </>
  )
}
