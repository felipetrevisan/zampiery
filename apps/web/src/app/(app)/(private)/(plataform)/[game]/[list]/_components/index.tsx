'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type GameFormSchema, gameFormSchema } from '@nathy/web/config/schemas/game'
import { useMutationAddPlayerToGameAndAttach } from '@nathy/web/hooks/mutations/grouped-list'
import { useGroupedListBySlugAndPlatform } from '@nathy/web/hooks/use-grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddGameDialog } from './add-game-dialog'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

export function GroupedListView({ list }: { list: GroupedList }) {
  const queryClient = useQueryClient()
  const { data: allData, isPending } = useGroupedListBySlugAndPlatform(
    list,
    list.slug,
    list.platform.slug,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const gameForm = useForm<GameFormSchema>({
    resolver: zodResolver(gameFormSchema),
    mode: 'all',
  })

  const { handleSubmit } = gameForm

  const { mutateAsync: addPlayerToGameAndAttach } = useMutationAddPlayerToGameAndAttach(queryClient)

  async function handleAddNewGame(data: GameFormSchema) {
    await addPlayerToGameAndAttach({ list, data })
    gameForm.reset()
  }

  return (
    <FormProvider {...gameForm}>
      <div className="space-y-4 p-4">
        <Header data={list} onDialogOpen={setIsDialogOpen} />
        <GroupedListTable
          allData={allData}
          dialogOpen={isDialogOpen}
          isPending={isPending}
          onDialogOpen={setIsDialogOpen}
          onSelectedDate={setSelectedDate}
        />
      </div>
      <AddGameDialog
        dialogOpen={isDialogOpen}
        onDialogOpen={setIsDialogOpen}
        onSubmit={handleSubmit(handleAddNewGame)}
        selectedDate={selectedDate}
      />
    </FormProvider>
  )
}
