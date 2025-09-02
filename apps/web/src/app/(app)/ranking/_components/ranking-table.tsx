'use client'

import { useRankingList } from '@nathy/web/hooks/use-ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingRanking } from './loading-ranking'
import { RankingRow } from './ranking-row'

interface TableProps {
  onDelete: (id: string) => void
  onSelectList: (list: Ranking | null) => void
  onDialogOpen: (state: boolean) => void
  initialData: Ranking[]
}

export function RankingTable({ initialData, onDelete, onSelectList, onDialogOpen }: TableProps) {
  const { data, isLoading, isPending } = useRankingList(initialData)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openEditDialog(list: Ranking) {
    onSelectList(list)
    onDialogOpen(true)
  }

  return (
    <>
      {isLoading ? (
        <LoadingRanking />
      ) : !isPending && !data?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl">
          <div className="p-10">
            <div className='flex items-center justify-center space-x-2 font-bold text-primary text-xl'>
              Nenhuma lista rankeada encontrada
            </div>
          </div>
        </div>
      ) : (
        <>
          {data?.map((ranking) => (
            <RankingRow
              key={ranking.id}
              ranking={ranking}
              onEdit={openEditDialog}
              onDelete={setDeleteId}
            />
          ))}
          <ConfirmDeleteAlert deleteId={deleteId} onSetDeleteId={setDeleteId} onDelete={onDelete} />
        </>
      )}
    </>
  )
}
