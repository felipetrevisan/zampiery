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
    <div className="group flex w-full items-center justify-between space-x-2 py-4">
      <div className="w-[400px] font-bold text-accent-foreground text-xl group-hover:text-primary">
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
        className="opacity-0 transition-opacity ease-in-out group-hover:opacity-100"
        context={list}
      />
    </div>
  )
}
