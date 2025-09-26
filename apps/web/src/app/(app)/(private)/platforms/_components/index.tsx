'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type PlatformFormSchema, platformFormSchema } from '@nathy/web/config/schemas/platform'
import {
  useMutationCreatePlatform,
  useMutationDeletePlatform,
  useMutationUpdatePlatform,
} from '@nathy/web/hooks/mutations/platform'
import { usePaginatedPlatform } from '@nathy/web/hooks/use-platform'
import type { PaginatedPlatforms, Platform } from '@nathy/web/types/platform'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Header } from './header'
import { PlatformsTable } from './platforms-table'

export function PlatformsList({ data }: { data: PaginatedPlatforms }) {
  const queryClient = useQueryClient()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { allPlatforms, hasNextPage, isPending, isFetchingNextPage, fetchNextPage } =
    usePaginatedPlatform(data)

  const platformForm = useForm<PlatformFormSchema>({
    resolver: zodResolver(platformFormSchema),
    mode: 'all',
  })

  const { handleSubmit } = platformForm

  const { mutateAsync: createPlatform } = useMutationCreatePlatform(queryClient)
  const { mutateAsync: updatePlatform } = useMutationUpdatePlatform(queryClient)
  const { mutateAsync: deletePlatform } = useMutationDeletePlatform(queryClient)

  async function handleAddNewPlatform(data: PlatformFormSchema) {
    await createPlatform(data)
    platformForm.reset()
  }

  async function handleEditPlatform(data: PlatformFormSchema) {
    if (!selectedPlatform) return
    await updatePlatform({ id: selectedPlatform.id, data })
    platformForm.reset()
  }

  async function handleDeletePlatform(id: string) {
    await deletePlatform(id)
  }

  return (
    <FormProvider {...platformForm}>
      <div className="space-y-4 p-4">
        <Header
          isDialogOpen={isDialogOpen}
          onDialogOpen={setIsDialogOpen}
          onEdit={handleSubmit(handleEditPlatform)}
          onSelectPlatform={setSelectedPlatform}
          onSubmit={handleSubmit(handleAddNewPlatform)}
          platformsTotalCount={allPlatforms.length}
          selectedPlatform={selectedPlatform}
        />
        <PlatformsTable
          allPlatforms={allPlatforms}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          onDelete={handleDeletePlatform}
          onDialogOpen={setIsDialogOpen}
          onSelectPlatform={setSelectedPlatform}
        />
      </div>
    </FormProvider>
  )
}
