'use client'

import { CountingNumber } from '@nathy/shared/ui/animated/text/counting-number'
import { Toolbar } from '@nathy/web/components/toolbar'
import type { Ranking } from '@nathy/web/types/ranking'
import { PencilIcon, Trash } from 'lucide-react'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (ranking: Ranking) => void
  ranking: Ranking
}

export function RankingRow({ ranking, onDelete, onEdit }: RowProps) {
  return (
    <div className="flex w-full items-center justify-between space-x-2 py-4">
      <div className="w-[400px] font-bold text-accent-foreground text-xl group-hover:text-primary">
        {ranking.title}
      </div>
      <div className="flex flex-col items-center justify-center text-accent-foreground group-hover:text-primary">
        <CountingNumber
          fromNumber={0}
          number={ranking.playersCount ?? 0}
          className="font-russo text-3xl"
        />{' '}
        pessoas
      </div>
      <Toolbar<Ranking>
        context={ranking}
        buttons={[
          {
            icon: PencilIcon,
            label: 'Editar Lista',
            ariaLabel: 'edit list',
            className:
              'bg-primary text-primary-foreground font-bold group-hover:bg-secondary group-hover:text-secondary-foreground',
            onClick: (list) => onEdit(list),
          },
          {
            icon: Trash,
            label: 'Deletar Lista',
            ariaLabel: 'delete list',
            className: 'bg-destructive text-destructive-foreground font-bold',
            onClick: (list) => onDelete(list.id),
          },
        ]}
      />
    </div>
  )
}
