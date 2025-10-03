'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMediaQuery } from '@nathy/shared/hooks/use-media-query'
import { cn } from '@nathy/shared/lib/utils'
import { mutateUpdateOrder } from '@nathy/web/server/ranking'
import type { Player } from '@nathy/web/types/player'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingPlayersRanking } from './loading-players-ranking'
import { PlayerRankingRowSkeleton } from './player-ranking-row-skeleton'
import { PlayerRow } from './player-row'

function SortableItem({
  player,
  index,
  onDelete,
}: {
  player: Player
  index: number
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
        'group relative flex flex-grow cursor-grab items-stretch overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50',
        {
          'z-50 scale-95 opacity-50 shadow-2xl': isDragging,
          'after:from-yellow-900/40 dark:after:from-yellow-400/30': index === 0,
          'after:from-gray-300/40': index === 1,
          'after:from-orange-400/40': index === 2,
        },
      )}
    >
      {isDragging ? (
        <div className="h-24 w-full animate-pulse rounded-2xl border-2 border-primary/40 border-dashed bg-muted/30" />
      ) : (
        <PlayerRow index={index} onDelete={onDelete} player={player} />
      )}
    </div>
  )
}

interface TableProps {
  onDelete: (id: string) => void
  data: PaginatedSingleRanking
  allData: Player[]
  hasNextPage: boolean
  isPending: boolean
  isFetchingNextPage: boolean
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<PaginatedSingleRanking, unknown>, Error>>
}

export function RankingListPlayerTable({
  allData,
  data,
  hasNextPage,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
  onDelete,
}: TableProps) {
  const [items, setItems] = useState<Player[]>(allData)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const parentRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const isMobile = useMediaQuery()

  const gap = isMobile ? .85 : 1.01

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allData?.length + 1 : allData?.length,
    estimateSize: () => 102 * gap,
    getItemKey: (index) => allData[index]?.id ?? `loader-${index}`,
    getScrollElement: () => parentRef.current,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 5,
  })

  useEffect(() => {
    if (allData) {
      setItems(allData)
    }
  }, [allData])

  useEffect(() => {
    if (!loaderRef.current || !parentRef.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        const ent = entries[0]
        if (ent.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root: parentRef.current, rootMargin: '200px' },
    )
    obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over?.id)
      const newItems = arrayMove(items, oldIndex, newIndex)

      setItems(newItems)
      mutateUpdateOrder({ ranking: data, newPlayerPosition: newItems }).then(() =>
        toast.success('Ordem foi atualizada com sucesso'),
      )
    }
  }

  return (
    <div className="space-y-2">
      {isPending ? (
        <LoadingPlayersRanking />
      ) : !allData?.length ? (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-primary-foreground">
              Nenhuma lista rankeada encontrada
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[700px] overflow-visible" ref={parentRef}>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  position: 'relative',
                  width: '100%',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                  const isLoader = virtualRow.index === items.length
                  const player = items[virtualRow.index]

                  if (isLoader) {
                    if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage()
                    }

                    return (
                      <div
                        key={`loader-${virtualRow.index}`}
                        ref={loaderRef}
                        style={{
                          height: virtualRow.size,
                          left: 0,
                          position: 'absolute',
                          top: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          width: '100%',
                        }}
                      >
                        <PlayerRankingRowSkeleton />
                      </div>
                    )
                  }

                  return (
                    <div
                      key={player.id}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        height: `${virtualRow.size}px`,
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateY(${virtualRow.start}px)`,
                        width: '100%',
                      }}
                    >
                      <div>
                        <SortableItem
                          index={index}
                          key={player.id}
                          onDelete={setDeleteId}
                          player={player}
                        />
                      </div>
                    </div>
                  )
                })}
                <ConfirmDeleteAlert
                  deleteId={deleteId}
                  onDelete={onDelete}
                  onSetDeleteId={setDeleteId}
                />
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
