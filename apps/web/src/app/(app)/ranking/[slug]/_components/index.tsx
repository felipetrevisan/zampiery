'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutationAddPersonToRanking,
  useMutationDeletePersonFromRanking,
} from '@nathy/web/hooks/mutations/ranking'
import { usePaginatedRankingListBySlug } from '@nathy/web/hooks/use-ranking'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'
import { Header } from './header'
import { RankingListPlayerTable } from './ranking-list-table'

const personFormSchema = z.object({
  person: z.object({
    id: z.string().min(1, 'Nome é obrigatório'),
    name: z.string().min(1),
  }),
})

export type PersonFormSchema = z.infer<typeof personFormSchema>

export function RankingListView({ data }: { data: PaginatedSingleRanking }) {
  const queryClient = useQueryClient()
  const { allData, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingListBySlug(data, data.slug)

  const personForm = useForm<PersonFormSchema>({
    resolver: zodResolver(personFormSchema),
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
        <Header data={data} onSubmit={handleSubmit(handleAddNewPerson)} />
        <RankingListPlayerTable
          allData={allData}
          hasNextPage={hasNextPage}
          isPending={isPending}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onDelete={handleDeletePerson}
        />
      </div>
    </FormProvider>
  )
}
