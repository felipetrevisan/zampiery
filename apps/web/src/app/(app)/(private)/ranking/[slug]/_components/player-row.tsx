'use client'

import { cn } from '@nathy/shared/lib/utils'
import { Toolbar } from '@nathy/web/components/toolbar'
import type { Player } from '@nathy/web/types/player'
import { formatOrdinals } from '@nathy/web/utils/number'
import { Trash } from 'lucide-react'

import './style.css'
import { getDicebearUrl } from '@nathy/web/utils/random-avatar'

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
          'pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/5',
          'bg-gradient-to-r from-transparent',
          index === 0 && 'to-yellow-600 dark:to-yellow-400/20',
          index === 1 && 'to-gray-300/40',
          index === 2 && 'to-orange-400/40',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 flex w-1/4 items-center sm:w-1/5',
          'bg-gradient-to-r to-transparent',
          index === 0 && 'from-yellow-600/20 dark:from-yellow-400/20',
          index === 1 && 'from-gray-300/20',
          index === 2 && 'from-orange-400/20',
        )}
      >
        <span className="relative z-10 px-2 font-extrabold font-russo text-3xl text-accent-foreground sm:px-4 sm:text-4xl md:text-5xl">
          {formatOrdinals(index + 1)}
        </span>
      </div>

      <div className='flex items-center justify-between gap-3 px-10 py-3 sm:px-10 sm:py-4 md:w-full md:px-20'>
        {player.avatar && (
          <div
            className="size-8 rounded-full bg-cover sm:size-10 md:size-12"
            style={{
              backgroundImage: `url(${getDicebearUrl({
                url: player.avatar,
                background: 'c0aede,d1d4f9,ffd5dc,ffdfbf',
              })})`,
            }}
          />
        )}

        <div className="flex-1 truncate font-bold text-accent-foreground text-base sm:text-lg md:text-xl">
          {player.name}
        </div>
      </div>

      {/* toolbar */}
      <Toolbar<Player>
        buttons={[
          {
            ariaLabel: 'delete person',
            className: 'bg-destructive text-destructive-foreground font-bold',
            icon: Trash,
            label: 'Deletar Pessoa',
            onClick: (player) => onDelete(player.id),
          },
        ]}
        className="md:opacity-0 md:transition-opacity md:ease-in-out md:group-hover:opacity-100"
        context={player}
      />

      {/* medalha */}
      {index < 3 && (
        <div
          className="medal absolute right-4 size-10 rounded-full backdrop-blur-xl sm:right-6 sm:size-12 md:right-10 md:size-[56px]"
          data-medal={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}
        />
      )}
    </>
  )
}
