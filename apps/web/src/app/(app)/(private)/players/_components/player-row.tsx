'use client'

import { useMediaQuery } from '@nathy/shared/hooks/use-media-query'
import { AnimateIcon } from '@nathy/shared/ui/animated/icons/icon'
import { Star } from '@nathy/shared/ui/animated/icons/star'
import { Toolbar } from '@nathy/web/components/toolbar'
import { type Player, PlayerPositionLabels } from '@nathy/web/types/player'
import { getDicebearUrl } from '@nathy/web/utils/random-avatar'
import { PencilIcon, Trash } from 'lucide-react'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (player: Player) => void
  player: Player
}

export function PlayerRow({ player, onDelete, onEdit }: RowProps) {
  const isMobile = useMediaQuery()

  return (
    <>
      {!isMobile && (
        <div className="relative hidden md:flex md:w-[80px] md:max-w-[80px] md:flex-shrink-0 md:items-center md:justify-center">
          {player.avatar && (
            <div
              className="size-16 rounded-full bg-cover"
              style={{
                backgroundImage: `url(${getDicebearUrl({ url: player.avatar, background: 'c0aede,d1d4f9,ffd5dc,ffdfbf' })}`,
              }}
            />
          )}
          {player.isFavorite && (
            <AnimateIcon asChild>
              <Star
                animate="fill"
                animation="fill"
                className="absolute top-0 right-0 text-amber-400"
              />
            </AnimateIcon>
          )}
        </div>
      )}
      <div className="flex flex-grow items-center justify-between space-x-4 px-4 py-4">
        <div className="flex flex-col md:grid md:flex-grow md:grid-cols-3 md:items-center">
          <div className="font-semibold text-accent-foreground text-lg group-hover:text-primary-foreground sm:text-xl">
            {player.name}
            {isMobile && player.isFavorite && (
              <AnimateIcon asChild>
                <Star
                  animate="fill"
                  animation="fill"
                  className="absolute top-0 right-0 text-amber-400"
                />
              </AnimateIcon>
            )}
          </div>
          <div className="md:justify-betwwen flex flex-col gap-4 md:flex-row md:items-center">
            {player.favoriteTeam && (
              <div className="font-russo text-accent-foreground text-xl group-hover:text-primary-foreground sm:text-lg md:text-center">
                {player.favoriteTeam.name}
              </div>
            )}
            {player.favoritePosition && (
              <div className="flex md:justify-end">
                <div className="rounded-full bg-secondary p-2 font-bold text-secondary-foreground text-sm shadow-secondary/30 shadow-xl md:p-3">
                  {PlayerPositionLabels[
                    player.favoritePosition as keyof typeof PlayerPositionLabels
                  ] ?? 'Posição Desconhecida'}
                </div>
              </div>
            )}
          </div>
        </div>
        <Toolbar<Player>
          buttons={[
            {
              icon: PencilIcon,
              label: 'Editar Jogador',
              ariaLabel: 'edit player',
              className:
                'bg-primary text-primary-foreground font-bold group-hover:bg-secondary group-hover:text-secondary-foreground',
              onClick: (player) => onEdit(player),
            },
            {
              icon: Trash,
              label: 'Deletar Jogador',
              ariaLabel: 'delete player',
              className: 'bg-destructive text-destructive-foreground',
              onClick: (player) => onDelete(player.id),
            },
          ]}
          context={player}
        />
      </div>
    </>
  )
}
