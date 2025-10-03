'use client'

import { Toolbar } from '@nathy/web/components/toolbar'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { PencilIcon, Trash } from 'lucide-react'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (list: GroupedList) => void
  list: GroupedList
}

export function GroupedListRow({ list, onDelete, onEdit }: RowProps) {
  return (
    <div className="group flex w-full items-center justify-between gap-4 py-4 md:gap-2">
      <div className="truncate text-left font-bold text-accent-foreground text-lg group-hover:text-primary sm:text-xl md:w-[400px]">
        {list.title}
      </div>
      <Toolbar<GroupedList>
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
        className='md:ransition-opacity md:opacity-0 md:ease-in-out md:group-hover:opacity-100'
        context={list}
      />
    </div>
  )
}
