'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useMutationCreatePlayer, useMutationDeletePlayer, useMutationUpdatePlayer } from '@nathy/web/hooks/mutations/player'
import {
  mutateCreatePlayer,
  mutateDeletePlayer,
  mutateUpdatePlayer,
} from '@nathy/web/server/player'
import type { Player } from '@nathy/web/types/player'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Header } from './header'
import { PlayersTable } from './players-table'

const playerFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  favoritePosition: z.string().optional(),
  favoriteTeam: z.string().optional(),
})

export type PlayerFormSchema = z.infer<typeof playerFormSchema>

export function PlayersList() {
  const queryClient = useQueryClient()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      <div className="space-y-4">
        <Header
          onSubmit={handleSubmit(handleAddNewPlayer)}
          onEdit={handleSubmit(handleEditPlayer)}
          onDialogOpen={setIsDialogOpen}
          onSelectPlayer={setSelectedPlayer}
          dialogOpen={isDialogOpen}
          selectedPlayer={selectedPlayer}
        />
        <PlayersTable
          onDelete={handleDeletePlayer}
          onDialogOpen={setIsDialogOpen}
          onSelectPlayer={setSelectedPlayer}
        />
      </div>
    </FormProvider>
  )
}
