'use client'

import { Avatar, AvatarFallback } from '@nathy/shared/ui/avatar'
import { Toolbar, ToolbarButton } from '@nathy/web/components/toolbar'
import { usePlayer } from '@nathy/web/hooks/use-player'
import { useTeam } from '@nathy/web/hooks/use-team'
import { type Player, PlayerPositionLabels } from '@nathy/web/types/player'
import { PencilIcon, Trash } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingPlayers } from './loading-players'
import { PlayerRow } from './player-row'

interface TableProps {
  onDelete: (id: string) => void
  onSelectPlayer: (player: Player | null) => void
  onDialogOpen: (state: boolean) => void
}

export function PlayersTable({ onDelete, onDialogOpen, onSelectPlayer }: TableProps) {
  const { data, isLoading, isPending } = usePlayer()
  const { data: teams } = useTeam()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openEditDialog(player: Player) {
    onSelectPlayer(player)
    onDialogOpen(true)
  }

  return (
    <div className="space-y-2">
      {isLoading ? (
        <LoadingPlayers />
      ) : !isPending && !data?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-neutral-200/80 p-3 backdrop-blur-2xl dark:bg-neutral-900/80">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground group-hover:text-primary-foreground">
              Nenhuma pessoa encontrada
            </div>
          </div>
        </div>
      ) : (
        <>
          {data?.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              teams={teams?.teams ?? []}
              onEdit={openEditDialog}
              onDelete={setDeleteId}
            />
          ))}
          <ConfirmDeleteAlert deleteId={deleteId} onSetDeleteId={setDeleteId} onDelete={onDelete} />
        </>
      )}
    </div>
  )
}
