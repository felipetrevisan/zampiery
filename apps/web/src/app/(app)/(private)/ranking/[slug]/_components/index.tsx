'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type PersonFormSchema, personFormSchema } from '@nathy/web/config/schemas/ranking'
import {
  useMutationAddPersonToRanking,
  useMutationDeletePersonFromRanking,
} from '@nathy/web/hooks/mutations/ranking'
import { usePaginatedRankingListBySlug } from '@nathy/web/hooks/use-ranking'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Header } from './header'
import { RankingListPlayerTable } from './ranking-list-table'

export function RankingListView({ data }: { data: PaginatedSingleRanking }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { allData, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingListBySlug(data, data.slug)

  const personForm = useForm<PersonFormSchema>({
    resolver: zodResolver(personFormSchema),
    mode: 'all',
  })

  const { handleSubmit } = personForm

  const { mutateAsync: addPersonToRanking } = useMutationAddPersonToRanking(queryClient)
  const { mutateAsync: deletePersonFromRanking } = useMutationDeletePersonFromRanking(queryClient)

  async function handleAddNewPerson(dataParsed: PersonFormSchema) {
    await addPersonToRanking({
      ranking: data,
      player: { id: dataParsed.person.id, name: dataParsed.person.name },
    })

    personForm.reset()
  }

  async function handleDeletePerson(id: string) {
    await deletePersonFromRanking({ ranking: data, playerId: id })
  }

  return (
    <FormProvider {...personForm}>
      <div className="space-y-4 p-4">
        <Header
          data={data}
          isDialogOpen={isDialogOpen}
          onDialogOpen={setIsDialogOpen}
          onSubmit={handleSubmit(handleAddNewPerson)}
          totalPlayers={allData.length}
        />
        <RankingListPlayerTable
          allData={allData}
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          onDelete={handleDeletePerson}
        />
      </div>
    </FormProvider>
  )
}
