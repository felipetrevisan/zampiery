'use client'

import { useMediaQuery } from '@nathy/shared/hooks/use-media-query'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingPlayers } from './loading-players'
import { PlayerRow } from './player-row'
import { PlayerRowSkeleton } from './player-row-skeleton'

interface TableProps {
  onDelete: (id: string) => void
  onSelectPlayer: (player: Player | null) => void
  onDialogOpen: (state: boolean) => void
  allPlayers: Player[]
  hasNextPage: boolean
  isPending: boolean
  isFetchingNextPage: boolean
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<PaginatedPlayers, unknown>, Error>>
}

export function PlayersTable({
  allPlayers,
  hasNextPage,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
  onDelete,
  onDialogOpen,
  onSelectPlayer,
}: TableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const parentRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const isMobile = useMediaQuery()

  const gap = isMobile ? 1 : 1.06

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allPlayers?.length + 1 : allPlayers?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 102 * gap,
    overscan: 5,
    getItemKey: (index) => allPlayers[index]?.id ?? `loader-${index}`,
    measureElement: (el) => el.getBoundingClientRect().height,
  })

  function openEditDialog(player: Player) {
    onSelectPlayer(player)
    onDialogOpen(true)
  }

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

  return (
    <div className="space-y-2">
      {isPending ? (
        <LoadingPlayers />
      ) : !allPlayers?.length ? (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-primary-foreground">
              Nenhuma pessoa encontrada
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[700px] overflow-visible" ref={parentRef}>
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoader = virtualRow.index === allPlayers.length
              const player = allPlayers[virtualRow.index]

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
                    <PlayerRowSkeleton />
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
                  <motion.div
                    className="group relative flex flex-grow overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50"
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 1.01 }}
                  >
                    <PlayerRow onDelete={setDeleteId} onEdit={openEditDialog} player={player} />
                  </motion.div>
                </div>
              )
            })}
            <ConfirmDeleteAlert
              deleteId={deleteId}
              onDelete={onDelete}
              onSetDeleteId={setDeleteId}
            />
          </div>
        </div>
      )}
    </div>
  )
}
