'use client'

import type { PaginatedRanking, Ranking } from '@nathy/web/types/ranking'
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDeleteAlert } from './confirm-delete'
import { LoadingRanking } from './loading-ranking'
import { RankingRow } from './ranking-row'
import { RankingRowSkeleton } from './ranking-row-skeleton'

interface TableProps {
  onDelete: (id: string) => void
  onSelectList: (list: Ranking | null) => void
  onDialogOpen: (state: boolean) => void
  allRankingList: Ranking[]
  hasNextPage: boolean
  isPending: boolean
  isFetchingNextPage: boolean
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<PaginatedRanking, unknown>, Error>>
}

export function RankingTable({
  allRankingList,
  hasNextPage,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
  onDelete,
  onSelectList,
  onDialogOpen,
}: TableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const parentRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRankingList?.length + 1 : allRankingList?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 102 * 1.27,
    overscan: 5,
    getItemKey: (index) => allRankingList[index]?.id ?? `loader-${index}`,
    measureElement: (el) => el.getBoundingClientRect().height,
  })

  function openEditDialog(list: Ranking) {
    onSelectList(list)
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
        <LoadingRanking />
      ) : !allRankingList?.length ? (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-primary-foreground">
              Nenhuma lista rankeada encontrada
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
              const isLoader = virtualRow.index === allRankingList.length
              const list = allRankingList[virtualRow.index]

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
                    <RankingRowSkeleton />
                  </div>
                )
              }

              return (
                <div
                  key={list.id}
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
                    className="group relative flex flex-grow cursor-pointer overflow-hidden rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50"
                    onClick={() => router.push(`ranking/${list.slug}`)}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 1.01 }}
                  >
                    <RankingRow onDelete={setDeleteId} onEdit={openEditDialog} ranking={list} />
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
