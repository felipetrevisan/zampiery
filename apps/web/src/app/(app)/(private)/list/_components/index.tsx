'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutationCreateGroupedList,
  useMutationDeleteGroupedList,
  useMutationUpdateGroupedList,
} from '@nathy/web/hooks/mutations/grouped-list'
import { usePaginatedRankingList } from '@nathy/web/hooks/use-grouped-list'
import type { GroupedList, PaginatedGroupedList } from '@nathy/web/types/grouped-list'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

const listFormSchema = z.object({
  title: z.string().min(1, 'Título da lista é obrigatório'),
})

export type ListFormSchema = z.infer<typeof listFormSchema>

export function GroupedListView({ data }: { data: PaginatedGroupedList }) {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState<GroupedList | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { allGroupedList, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedRankingList(data)

  const listForm = useForm<ListFormSchema>({
    resolver: zodResolver(listFormSchema),
  })

  const { handleSubmit } = listForm

  const { mutateAsync: createList } = useMutationCreateGroupedList(queryClient)
  const { mutateAsync: updateList } = useMutationUpdateGroupedList(queryClient)

  const { mutateAsync: deleteList } = useMutationDeleteGroupedList(queryClient)

  async function handleAddNewList(data: ListFormSchema) {
    await createList(data)
    listForm.reset()
  }

  async function handleEditList(data: ListFormSchema) {
    if (!selectedList) return
    await updateList({ id: selectedList.id, data })
    listForm.reset()
  }

  async function handleDeleteList(id: string) {
    await deleteList(id)
  }

  return (
    <FormProvider {...listForm}>
      <div className="space-y-4 p-4">
        <Header
          dialogOpen={isDialogOpen}
          groupedListTotalCount={allGroupedList.length}
          onDialogOpen={setIsDialogOpen}
          onEdit={handleSubmit(handleEditList)}
          onSelectList={setSelectedList}
          onSubmit={handleSubmit(handleAddNewList)}
          selectedList={selectedList}
        />
        <GroupedListTable
          allGroupedList={allGroupedList}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          onDelete={handleDeleteList}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
        />
      </div>
    </FormProvider>
  )
}
