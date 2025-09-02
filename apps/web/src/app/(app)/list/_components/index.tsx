'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { mutateCreateGroupedList, mutateUpdateGroupedList } from '@nathy/web/server/grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { GroupedListTable } from './grouped-list-table'
import { Header } from './header'

const listFormSchema = z.object({
  title: z.string().min(1, 'Título da lista é obrigatório'),
})

export type ListFormSchema = z.infer<typeof listFormSchema>

export function GroupedListView() {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState<GroupedList | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const listForm = useForm<ListFormSchema>({
    resolver: zodResolver(listFormSchema),
  })

  const { handleSubmit } = listForm

  const { mutateAsync: createGroupedList } = useMutation({
    mutationFn: (data: Omit<GroupedList, 'id' | 'games' | 'slug'>) => mutateCreateGroupedList(data),
    onSuccess: (newList) => {
      const sanitizedList = {
        ...newList,
        id: newList.id,
        slug: newList.slug,
      }

      queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) =>
        old ? [...old, sanitizedList] : [sanitizedList],
      )

      toast.success('Lista criada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao criar a lista')
    },
  })

  const { mutateAsync: updateGroupedList } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<GroupedList, 'id' | 'games' | 'slug'> }) =>
      mutateUpdateGroupedList(id, data),
    onSuccess: (updatedList) => {
      queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) =>
        old
          ? old.map((list) => (list.id === updatedList.id ? { ...list, ...updatedList } : list))
          : [updatedList],
      )
      toast.success('Lista atualizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar a lista')
    },
  })

  // const { mutateAsync: deleteList } = useMutation({
  //   mutationFn: (id: string) => mutateDeleteList(id),
  //   onSuccess: (_, id) => {
  //     queryClient.setQueryData<List[]>(
  //       ['lists-names'],
  //       (old) => old?.filter((list) => list.id !== id) ?? [],
  //     )
  //     toast.success('Lista deletada com sucesso')
  //   },
  //   onError: () => {
  //     toast.error('Erro ao deletar a lista')
  //   },
  // })

  // const { mutateAsync: deleteDraftList } = useMutation({
  //   mutationFn: (id: string) => mutateDeleteDraftList(id),
  // })

  async function handleAddNewList(data: ListFormSchema) {
    await createGroupedList(data)
    listForm.reset()
  }

  async function handleEditList(data: ListFormSchema) {
    if (!selectedList) return
    await updateGroupedList({ id: selectedList.id, data })
    listForm.reset()
  }

  async function handleDeleteList(id: string) {
    //await deleteList(id)
  }

  return (
    <FormProvider {...listForm}>
      <div className="space-y-4">
        <Header
          onSubmit={handleSubmit(handleAddNewList)}
          onEdit={handleSubmit(handleEditList)}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
          dialogOpen={isDialogOpen}
          selectedList={selectedList}
        />
        <GroupedListTable
          onDelete={handleDeleteList}
          onDialogOpen={setIsDialogOpen}
          onSelectList={setSelectedList}
        />
      </div>
    </FormProvider>
  )
}
