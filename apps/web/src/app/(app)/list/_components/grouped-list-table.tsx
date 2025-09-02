'use client'

import { Toolbar } from '@nathy/web/components/toolbar'
import { useGroupedList } from '@nathy/web/hooks/use-grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { PencilIcon, Trash } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'

interface TableProps {
  onDelete: (id: string) => void
  onSelectList: (list: GroupedList | null) => void
  onDialogOpen: (state: boolean) => void
}

export function GroupedListTable({ onDelete, onSelectList, onDialogOpen }: TableProps) {
  const { data } = useGroupedList()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  function openEditDialog(list: GroupedList) {
    onSelectList(list)
    onDialogOpen(true)
  }

  return (
    <>
      {!data?.length && (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:bg-primary/80 dark:bg-neutral-900/80">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 group-hover:text-primary-foreground">
              Nenhuma lista encontrada
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {data?.map((list) => (
          <motion.div
            className="group relative flex flex-grow cursor-pointer overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:bg-primary/80 dark:bg-neutral-900/80"
            key={list.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={() => router.push(`list/${list.slug}`)}
          >
            <div className="flex w-full items-center justify-between space-x-2 py-4">
              <div className="font-bold text-primary group-hover:text-primary-foreground">
                {list.title}
              </div>
              <Toolbar<GroupedList>
                context={list}
                buttons={[
                  {
                    icon: PencilIcon,
                    label: 'Editar Lista',
                    ariaLabel: 'edit list',
                    className:
                      'bg-primary text-primary-foreground font-bold group-hover:bg-secondary group-hover:text-secondary-foreground',
                    onClick: (list) => openEditDialog(list),
                  },
                  {
                    icon: Trash,
                    label: 'Deletar Listar',
                    ariaLabel: 'delete list',
                    className: 'bg-destructive text-destructive-foreground',
                    onClick: (list) => setDeleteId(list.id),
                  },
                ]}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <ConfirmDeleteAlert deleteId={deleteId} onSetDeleteId={setDeleteId} onDelete={onDelete} />
    </>
  )
}
