'use client'

import { Avatar, AvatarFallback } from '@nathy/shared/ui/avatar'
import { Toolbar } from '@nathy/web/components/toolbar'
import { type Player, PlayerPositionLabels } from '@nathy/web/types/player'
import type { Team } from '@nathy/web/types/team'
import { PencilIcon, Trash } from 'lucide-react'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (player: Player) => void
  player: Player
  teams: Team[]
}

export function PlayerRow({ player, teams, onDelete, onEdit }: RowProps) {
  return (
    <>
      <div className="flex w-[80px] max-w-[80px] flex-shrink-0 items-center justify-center">
        <Avatar>
          <AvatarFallback>FC</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-grow items-center justify-between space-x-4 px-4 py-4">
        <div className="grid flex-grow grid-cols-3 items-center">
          <div className="font-semibold text-accent-foreground text-xl group-hover:text-primary">
            {player.name}
          </div>
          {player.favoriteTeam && (
            <div className="text-center font-russo text-accent-foreground text-xl group-hover:text-primary">
              {teams?.find((t) => t.id === player.favoriteTeam)?.name}
            </div>
          )}
          {player.favoritePosition && (
            <div className="flex justify-end">
              <div className="rounded-full bg-secondary p-3 font-bold text-secondary-foreground text-sm shadow-secondary/30 shadow-xl">
                {PlayerPositionLabels[
                  player.favoritePosition as keyof typeof PlayerPositionLabels
                ] ?? 'Posição Desconhecida'}
              </div>
            </div>
          )}
        </div>
        <Toolbar<Player>
          context={player}
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
        />
      </div>
    </>
  )
}
