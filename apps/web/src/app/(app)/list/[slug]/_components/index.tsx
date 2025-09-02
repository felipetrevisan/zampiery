'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useGroupedListBySlug } from '@nathy/web/hooks/use-grouped-list'
import {
  mutateAddPlayerGame,
  mutateAttachGameToList,
} from '@nathy/web/server/grouped-list'
import { gameFormSchema } from '@nathy/web/types/game'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

export type GameFormSchema = z.infer<typeof gameFormSchema>

export function GroupedListView({ data }: { data: GroupedList }) {
  const queryClient = useQueryClient()
  const { data: list } = useGroupedListBySlug(data, data.slug)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const gameForm = useForm<GameFormSchema>({
    resolver: zodResolver(gameFormSchema),
  })

  const { handleSubmit } = gameForm

  const { mutateAsync: addPlayerToGameAndAttach } = useMutation({
    mutationFn: async (data: { form: GameFormSchema; listId: string }) => {
      const game = await mutateAddPlayerGame(data.form)
      return mutateAttachGameToList({ game: { _id: game._id }, listId: data.listId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grouped-list', list.slug] })
      toast.success('Jogo criado e adicionado à lista!')
    },
    onError: () => {
      toast.error('Erro ao criar jogo')
    },
  })

  async function handleAddNewList(data: GameFormSchema) {
    await addPlayerToGameAndAttach({ listId: list.id, form: data })
    gameForm.reset()
  }

  return (
    <FormProvider {...gameForm}>
      <div className="space-y-2">
        <Header
          onSubmit={handleSubmit(handleAddNewList)}
          onDialogOpen={setIsDialogOpen}
          dialogOpen={isDialogOpen}
          list={list}
        />
        <GroupedListTable list={list} />
      </div>
    </FormProvider>
  )
}
