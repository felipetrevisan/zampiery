'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type ListFormSchema, listFormSchema } from '@nathy/web/config/schemas/grouped-list'
import {
  useMutationCreateGroupedList,
  useMutationDeleteGroupedList,
  useMutationUpdateGroupedList,
} from '@nathy/web/hooks/mutations/grouped-list'
import { usePaginatedPlatformListByPlatform } from '@nathy/web/hooks/use-platform'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import type { PaginatedPlatformListByPlatform } from '@nathy/web/types/platform'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

export function PlatformGameListView({ platform }: { platform: PaginatedPlatformListByPlatform }) {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState<GroupedList | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { allGroupedList, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedPlatformListByPlatform(platform, platform.slug)

  const listForm = useForm<ListFormSchema>({
    resolver: zodResolver(listFormSchema),
    mode: 'all',
  })

  const { handleSubmit } = listForm

  const { mutateAsync: createList } = useMutationCreateGroupedList(queryClient)
  const { mutateAsync: updateList } = useMutationUpdateGroupedList(queryClient)
  const { mutateAsync: deleteList } = useMutationDeleteGroupedList(queryClient)

  async function handleAddNewList(data: ListFormSchema) {
    await createList({ ...data, platform })
    listForm.reset()
  }

  async function handleEditList(data: ListFormSchema) {
    if (!selectedList) return
    await updateList({ id: selectedList.id, data, platform: platform.slug })
    listForm.reset()
  }

  async function handleDeleteList(id: string) {
    await deleteList({ id, platform: platform.slug })
  }

  return (
    <FormProvider {...listForm}>
      <div className="space-y-4 p-4">
        <Header
          data={platform}
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
          platform={platform}
        />
      </div>
    </FormProvider>
  )
}
