'use client'

import { CountingNumber } from '@nathy/shared/ui/animated/text/counting-number'
import { Toolbar } from '@nathy/web/components/toolbar'
import type { Ranking } from '@nathy/web/types/ranking'
import { PencilIcon, Trash } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (ranking: Ranking) => void
  ranking: Ranking
}

export function RankingRow({ ranking, onDelete, onEdit }: RowProps) {
  const router = useRouter()

  return (
    <motion.div
      className="group relative flex flex-grow cursor-pointer overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:bg-primary/80 dark:bg-neutral-900/80"
      key={ranking.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      onClick={() => router.push(`ranking/${ranking.slug}`)}
    >
      <div className="flex w-full items-center justify-between space-x-2 py-4">
        <div className='w-[400px] font-bold text-primary text-xl group-hover:text-primary-foreground'>
          {ranking.title}
        </div>
        <div className="flex flex-col items-center justify-center text-primary group-hover:text-primary-foreground">
          <CountingNumber
            fromNumber={0}
            number={ranking.playersCount}
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
    </motion.div>
  )
}
