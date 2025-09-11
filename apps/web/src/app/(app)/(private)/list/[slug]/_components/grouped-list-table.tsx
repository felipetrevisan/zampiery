'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import type { Game } from '@nathy/web/types/game'
import type { PaginatedSingleGroupedList } from '@nathy/web/types/grouped-list'
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DatesRowSkeleton } from './dates-row-skeleton'
import { GameAddButton } from './game/add-button'
// import { ConfirmDeleteAlert } from './confirm-delete'
import { GameCard } from './game/card'
import { DateGroup } from './group/date'
import { LoadingDates } from './loading-dates'

interface TableProps {
  data: PaginatedSingleGroupedList
  allData: Game[]
  hasNextPage: boolean
  isPending: boolean
  isFetchingNextPage: boolean
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<PaginatedSingleGroupedList, unknown>, Error>
  >
}

export function GroupedListTable({
  data,
  allData,
  hasNextPage,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
}: TableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGameDate, setSelectedDateGame] = useState<string | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const [groupedByDate, setGroupedByDate] = useState(() =>
    allData?.reduce((acc: Record<string, typeof allData>, game) => {
      if (!game?.date) return acc
      if (!acc[game.date]) acc[game.date] = []
      acc[game.date].push(game)
      return acc
    }, {}),
  )

  const sortedDates = useMemo(
    () =>
      Object.entries(groupedByDate || {}).sort(
        ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
      ),
    [groupedByDate],
  )

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: hasNextPage ? sortedDates.length + 1 : sortedDates.length,
    estimateSize: () => 100, // altura média aproximada de cada grupo; ajuste se necessário
    getItemKey: (index) =>
      index < sortedDates.length ? `date-${sortedDates[index][0]}` : `loader-${index}`,
    getScrollElement: () => parentRef.current,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 3,
  })

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

  function handleDragEnd(event: DragEndEvent, date: string) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setGroupedByDate((prev) => {
      const updated = { ...prev }
      const games = [...updated[date]]
      const oldIndex = games.findIndex((g) => g.slug === active.id)
      const newIndex = games.findIndex((g) => g.slug === over.id)
      updated[date] = arrayMove(games, oldIndex, newIndex)
      return updated
    })
  }

  function handleAddGameDialog(date: string) {
    setSelectedDateGame(date)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-2">
      {isPending ? (
        <LoadingDates />
      ) : !sortedDates?.length ? (
        <div className="group space-y-6 rounded-2xl border border-primary/20 bg-neutral-200/80 p-3 backdrop-blur-2xl dark:bg-neutral-900/80">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground group-hover:text-primary-foreground">
              Nenhuma data de jogos encontrado
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[700px] overflow-auto" ref={parentRef}>
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const [date, games] = sortedDates[virtualRow.index]
              const isLoader = virtualRow.index === sortedDates.length

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
                    <DatesRowSkeleton />
                  </div>
                )
              }

              return (
                <div
                  key={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <DateGroup
                    date={date}
                    games={games}
                    onAddGame={() => handleAddGameDialog(date)}
                    onDragEnd={(e) => handleDragEnd(e, date)}
                    rowVirtualizer={rowVirtualizer}
                    sensors={sensors}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
