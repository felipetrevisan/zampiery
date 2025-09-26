'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type RankingListFormSchema,
  rankingListFormSchema,
} from '@nathy/web/config/schemas/ranking'
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
import { Header } from './header'
import { RankingTable } from './ranking-table'

export function RankingList({ data }: { data: PaginatedRanking }) {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState<Ranking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { allRankingList, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingList(data)

  const rankingListForm = useForm<RankingListFormSchema>({
    resolver: zodResolver(rankingListFormSchema),
    mode: 'all',
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
          isDialogOpen={isDialogOpen}
          onDialogOpen={setIsDialogOpen}
          onEdit={handleSubmit(handleEditRankingList)}
          onSelectList={setSelectedList}
          onSubmit={handleSubmit(handleAddNewRankingList)}
          rankingListTotalCount={allRankingList.length}
          selectedList={selectedList}
        />
        <RankingTable
          allRankingList={allRankingList}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          onDelete={handleDeleteRankingList}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
        />
      </div>
    </FormProvider>
  )
}
