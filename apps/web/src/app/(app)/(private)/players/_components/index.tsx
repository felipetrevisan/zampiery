'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutationCreatePlayer,
  useMutationDeletePlayer,
  useMutationUpdatePlayer,
} from '@nathy/web/hooks/mutations/player'
import { usePaginatedPlayer } from '@nathy/web/hooks/use-player'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Header } from './header'
import { PlayersTable } from './players-table'

const playerFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  favoritePosition: z.string().optional(),
  favoriteTeam: z.string().optional(),
})

export type PlayerFormSchema = z.infer<typeof playerFormSchema>

export function PlayersList({ data }: { data: PaginatedPlayers }) {
  const queryClient = useQueryClient()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { allPlayers, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedPlayer(data)

  const playerForm = useForm<PlayerFormSchema>({
    resolver: zodResolver(playerFormSchema),
  })

  const { handleSubmit } = playerForm

  const { mutateAsync: createPlayer } = useMutationCreatePlayer(queryClient)
  const { mutateAsync: updatePlayer } = useMutationUpdatePlayer(queryClient)
  const { mutateAsync: deletePlayer } = useMutationDeletePlayer(queryClient)

  async function handleAddNewPlayer(data: PlayerFormSchema) {
    await createPlayer(data)
    playerForm.reset()
  }

  async function handleEditPlayer(data: PlayerFormSchema) {
    if (!selectedPlayer) return
    await updatePlayer({ id: selectedPlayer.id, data })
    playerForm.reset()
  }

  async function handleDeletePlayer(id: string) {
    await deletePlayer(id)
  }

  return (
    <FormProvider {...playerForm}>
      <div className="space-y-4 p-4">
        <Header
          dialogOpen={isDialogOpen}
          onDialogOpen={setIsDialogOpen}
          onEdit={handleSubmit(handleEditPlayer)}
          onSelectPlayer={setSelectedPlayer}
          onSubmit={handleSubmit(handleAddNewPlayer)}
          playersTotalCount={allPlayers.length}
          selectedPlayer={selectedPlayer}
        />
        <PlayersTable
          allPlayers={allPlayers}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          onDelete={handleDeletePlayer}
          onDialogOpen={setIsDialogOpen}
          onSelectPlayer={setSelectedPlayer}
        />
      </div>
    </FormProvider>
  )
}
