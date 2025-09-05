'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutationCreateRanking,
  useMutationDeleteRanking,
  useMutationUpdateRanking,
} from '@nathy/web/hooks/mutations/ranking'
import { usePaginatedRankingList } from '@nathy/web/hooks/use-ranking'
import type { PaginatedRanking, Ranking } from '@nathy/web/types/ranking'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Header } from './header'
import { RankingTable } from './ranking-table'

const rankingListFormSchema = z.object({
  title: z.string().min(1, 'Título da lista é obrigatório'),
})

export type RankingListFormSchema = z.infer<typeof rankingListFormSchema>

export function RankingList({ data }: { data: PaginatedRanking }) {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState<Ranking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { allRankingList, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingList(data)

  const rankingListForm = useForm<RankingListFormSchema>({
    resolver: zodResolver(rankingListFormSchema),
  })

  const { handleSubmit } = rankingListForm

  const { mutateAsync: createRankingList } = useMutationCreateRanking(queryClient)
  const { mutateAsync: updateRankingList } = useMutationUpdateRanking(queryClient)
  const { mutateAsync: deleteRankingList } = useMutationDeleteRanking(queryClient)

  async function handleAddNewRankingList(data: RankingListFormSchema) {
    await createRankingList(data)
    rankingListForm.reset()
  }

  async function handleEditRankingList(data: RankingListFormSchema) {
    if (!selectedList) return
    await updateRankingList({ id: selectedList.id, data })
    rankingListForm.reset()
  }

  async function handleDeleteRankingList(id: string) {
    await deleteRankingList(id)
  }

  return (
    <FormProvider {...rankingListForm}>
      <div className="space-y-4 p-4">
        <Header
          onSubmit={handleSubmit(handleAddNewRankingList)}
          onEdit={handleSubmit(handleEditRankingList)}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
          dialogOpen={isDialogOpen}
          selectedList={selectedList}
          rankingListTotalCount={allRankingList.length}
        />
        <RankingTable
          onDelete={handleDeleteRankingList}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
          allRankingList={allRankingList}
          hasNextPage={hasNextPage}
          isPending={isPending}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </FormProvider>
  )
}
