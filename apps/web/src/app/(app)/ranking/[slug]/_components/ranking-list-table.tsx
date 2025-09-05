'use client'

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@nathy/shared/lib/utils'
import type { Player } from '@nathy/web/types/player'
// import { saveOrder } from '@nathy/web/server/ranking'
import type { PaginatedSingleRanking } from '@nathy/web/types/ranking'
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef, useState } from 'react'
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
  hasNextPage,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
  onDelete,
}: TableProps) {
  // const {
  //   data: listData,
  //   isLoading,
  //   isPending,
  // } = useRankingListBySlug(initialData, initialData.slug)
  const [items, setItems] = useState<Player[]>(allData)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const parentRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allData?.length + 1 : allData?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 102 * .9,
    overscan: 5,
    getItemKey: (index) => allData[index]?.id ?? `loader-${index}`,
    measureElement: (el) => el.getBoundingClientRect().height,
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

  console.log(allData, items)

  return (
    <div className="space-y-2">
      {/* {isLoading ? (
        <LoadingPlayers />
      ) : !isPending && !items?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 font-bold text-primary text-xl">
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
      )} */}
      {isPending ? (
        <LoadingPlayersRanking />
      ) : !allData?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-neutral-200/80 p-3 backdrop-blur-2xl dark:bg-neutral-900/80">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground group-hover:text-primary-foreground">
              Nenhuma lista rankeada encontrada
            </div>
          </div>
        </div>
      ) : (
        <div ref={parentRef} className="h-[700px] overflow-visible">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={items.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
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
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          height: virtualRow.size,
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
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: `translateY(${virtualRow.start}px)`,
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <div>
                        <SortableItem
                          key={player.id}
                          player={player}
                          index={index}
                          onDelete={setDeleteId}
                        />
                      </div>
                    </div>
                  )
                })}
                <ConfirmDeleteAlert
                  deleteId={deleteId}
                  onSetDeleteId={setDeleteId}
                  onDelete={onDelete}
                />
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
