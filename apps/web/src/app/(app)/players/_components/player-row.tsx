'use client'

import { Avatar, AvatarFallback } from '@nathy/shared/ui/avatar'
import { Toolbar, ToolbarButton } from '@nathy/web/components/toolbar'
import { usePlayer } from '@nathy/web/hooks/use-player'
import { useTeam } from '@nathy/web/hooks/use-team'
import { type Player, PlayerPositionLabels } from '@nathy/web/types/player'
import type { Team } from '@nathy/web/types/team'
import { PencilIcon, Trash } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (player: Player) => void
  player: Player
  teams: Team[]
}

export function PlayerRow({ player, teams, onDelete, onEdit }: RowProps) {
  return (
    <motion.div
      className="group relative flex flex-grow overflow-hidden rounded-2xl border-1 border-primary/20 bg-neutral-200/80 p-3 backdrop-blur-2xl hover:bg-primary/80 dark:bg-neutral-900/80"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="w-[40px] max-w-[40px] flex-shrink-0">
        <Avatar>
          <AvatarFallback>FC</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-grow items-center justify-between space-x-4 px-4 py-4">
        <div className="grid flex-grow grid-cols-3 items-center">
          <div className="font-semibold text-lg text-primary group-hover:text-primary-foreground dark:text-white">
            {player.name}
          </div>
          {player.favoriteTeam && (
            <div className="text-center font-russo text-primary text-xl group-hover:text-primary-foreground">
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
    </motion.div>
  )
}
