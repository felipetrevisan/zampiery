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
    <div className="group flex w-full items-center justify-between gap-4 py-4 md:gap-2">
      <div className="truncate text-left font-bold text-accent-foreground text-lg group-hover:text-primary sm:text-xl md:w-[400px]">
        {ranking.title}
      </div>
      <div className="flex flex-row items-center justify-center gap-2 text-accent-foreground group-hover:text-primary md:flex-col md:gap-0">
        <CountingNumber
          className="font-russo text-2xl sm:text-3xl"
          fromNumber={0}
          number={ranking.total ?? 0}
        />{' '}
        <span className="text-sm sm:text-base">pessoas</span>
      </div>

      <Toolbar<Ranking>
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
        className="mt-2 md:mt-0 md:opacity-0 md:transition-opacity md:ease-in-out md:group-hover:opacity-100"
        context={ranking}
      />
    </div>
  )
}
