'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePaginatedRankingListBySlug } from '@nathy/web/hooks/use-grouped-list'
import { gameFormSchema } from '@nathy/web/types/game'
import type { PaginatedSingleGroupedList } from '@nathy/web/types/grouped-list'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

export type GameFormSchema = z.infer<typeof gameFormSchema>

export function GroupedListView({ data }: { data: PaginatedSingleGroupedList }) {
  const queryClient = useQueryClient()
  const { allData, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingListBySlug(data, data.slug)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const gameForm = useForm<GameFormSchema>({
    resolver: zodResolver(gameFormSchema),
  })

  const { handleSubmit } = gameForm

  // const { mutateAsync: addPlayerToGameAndAttach } = useMutation({
  //   mutationFn: async (data: { form: GameFormSchema; listId: string }) => {
  //     const game = await mutateAddPlayerGame(data.form)
  //     return mutateAttachGameToList({ game: { _id: game._id }, listId: data.listId })
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['grouped-list', list.slug] })
  //     toast.success('Jogo criado e adicionado à lista!')
  //   },
  //   onError: () => {
  //     toast.error('Erro ao criar jogo')
  //   },
  // })

  async function handleAddNewList(data: GameFormSchema) {
    //await addPlayerToGameAndAttach({ listId: list.id, form: data })
    gameForm.reset()
  }

  return (
    <FormProvider {...gameForm}>
      <div className="space-y-4 p-4">
        <Header
          data={data}
          dialogOpen={isDialogOpen}
          onDialogOpen={setIsDialogOpen}
          onSubmit={handleSubmit(handleAddNewList)}
        />
        <GroupedListTable
          allData={allData}
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
        />
      </div>
    </FormProvider>
  )
}
