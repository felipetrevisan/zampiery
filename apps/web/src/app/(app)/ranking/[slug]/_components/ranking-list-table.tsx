'use client'

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@nathy/shared/lib/utils'
import { useRankingListBySlug } from '@nathy/web/hooks/use-ranking'
import type { Player } from '@nathy/web/types/player'
// import { saveOrder } from '@nathy/web/server/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { useEffect, useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingPlayers } from './loading-players'
import { PlayerRow } from './player-row'

function SortableItem({
  player,
  index,
  onDelete,
}: { player: Player; index: number; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: player.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative flex flex-grow cursor-grab items-stretch overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:bg-primary/80 dark:bg-neutral-900/80',
        index === 0 && 'after:from-yellow-900/40 dark:after:from-yellow-400/30',
        index === 1 && 'after:from-gray-300/40',
        index === 2 && 'after:from-orange-400/40',
      )}
    >
      <PlayerRow player={player} index={index} onDelete={onDelete} />
    </div>
  )
}

interface TableProps {
  onDelete: (id: string) => void
  initialData: Ranking
}

export function RankingListPlayerTable({ initialData, onDelete }: TableProps) {
  const {
    data: listData,
    isLoading,
    isPending,
  } = useRankingListBySlug(initialData, initialData.slug)
  const [items, setItems] = useState<Player[]>(listData.players)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (listData?.players) {
      setItems(listData.players)
    }
  }, [listData?.players])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  )

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        const updated = newItems.map((item, idx) => ({
          ...item,
          position: idx + 1,
        }))

        //saveOrder(initialData.id, updated)

        return updated
      })
    }
  }

  return (
    <div className="space-y-2">
      {isLoading ? (
        <LoadingPlayers />
      ) : !isPending && !items?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl">
          <div className="p-10">
            <div className='flex items-center justify-center space-x-2 font-bold text-primary text-xl'>
              Nenhuma pessoa encontrada
            </div>
          </div>
        </div>
      ) : (
        <>
          {items?.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((player, index) => (
                  <SortableItem
                    key={player.id}
                    player={player}
                    index={index}
                    onDelete={setDeleteId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          <ConfirmDeleteAlert deleteId={deleteId} onSetDeleteId={setDeleteId} onDelete={onDelete} />
        </>
      )}
    </div>
  )
}
