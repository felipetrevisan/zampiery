'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutationAddPersonToRanking,
  useMutationDeletePersonFromRanking,
} from '@nathy/web/hooks/mutations/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
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

export function RankingListView(ranking: Ranking) {
  const queryClient = useQueryClient()

  const personForm = useForm<PersonFormSchema>({
    resolver: zodResolver(personFormSchema),
  })

  const { handleSubmit } = personForm

  const { mutateAsync: addPersonToRanking } = useMutationAddPersonToRanking(queryClient)
  const { mutateAsync: deletePersonFromRanking } = useMutationDeletePersonFromRanking(queryClient)

  async function handleAddNewPerson(data: PersonFormSchema) {
    await addPersonToRanking({
      ranking,
      player: { id: data.person.id, name: data.person.name },
    })

    personForm.reset()
  }

  async function handleDeletePerson(id: string) {
    await deletePersonFromRanking({ ranking, playerId: id })
  }

  return (
    <FormProvider {...personForm}>
      <div className="space-y-4">
        <Header data={ranking} onSubmit={handleSubmit(handleAddNewPerson)} />
        <RankingListPlayerTable initialData={ranking} onDelete={handleDeletePerson} />
      </div>
    </FormProvider>
  )
}
