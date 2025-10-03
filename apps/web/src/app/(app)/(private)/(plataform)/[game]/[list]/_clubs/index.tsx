'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ClubLineup } from '@nathy/web/app/(app)/(private)/(plataform)/[game]/[list]/_clubs/clubs-lineup'
import { type FormationFormSchema, formationFormSchema } from '@nathy/web/config/schemas/formation'
import { useFormation } from '@nathy/web/hooks/use-formation'
import { useGroupedListBySlugAndPlatform } from '@nathy/web/hooks/use-grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Header } from './header'

export function ClubsView({ list }: { list: GroupedList }) {
  const queryClient = useQueryClient()
  const { data: allData, isPending } = useGroupedListBySlugAndPlatform(
    list,
    list.slug,
    list.platform.slug,
  )
  const { data: formations, isPending: isFormationPending } = useFormation()

  // const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const formationForm = useForm<FormationFormSchema>({
    resolver: zodResolver(formationFormSchema),
    mode: 'all',
  })

  const { handleSubmit } = formationForm

  const selectedFormation = formationForm.watch('formation')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getFormationPositions = useMemo(() => {
    return formations?.find((formation) => formation.id === selectedFormation)?.positions
  }, [selectedFormation])

  // const { mutateAsync: addPlayerToGameAndAttach } = useMutationAddPlayerToGameAndAttach(queryClient)

  // async function handleAddNewGame(data: GameFormSchema) {
  //   await addPlayerToGameAndAttach({ list, data })
  //   gameForm.reset()
  // }

  return (
    <FormProvider {...formationForm}>
      <div className="space-y-4 p-4">
        <Header data={allData} formations={formations ?? []} />
        <ClubLineup
          allData={allData}
          isPending={isPending}
          selectedFormationPositions={getFormationPositions}
        />
      </div>
    </FormProvider>
  )
}
