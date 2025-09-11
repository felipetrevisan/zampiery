import { closestCenter, DndContext, type DragEndEvent, type useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@nathy/shared/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import type { Game } from '@nathy/web/types/game'
import type { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef } from 'react'
import { GameAddButton } from '../game/add-button'
import { GameCard } from '../game/card'

export function DateGroup({
  date,
  games,
  rowVirtualizer,
  sensors,
  onDragEnd,
  onAddGame,
}: {
  date: string
  games: Game[]
  rowVirtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, HTMLDivElement>>
  sensors: ReturnType<typeof useSensors>
  onDragEnd: (e: DragEndEvent) => void
  onAddGame: () => void
}) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    rowVirtualizer.measure()

    let raf = 0
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        rowVirtualizer.measure()
      })
    })

    ro.observe(el)
    return () => {
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [rowVirtualizer])

  function SortableGameCard({ game, index }: { game: Game; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: game.slug,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <GameCard
          className={cn({ 'z-50 scale-95 opacity-50 shadow-2xl': isDragging })}
          game={game}
          index={index}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col rounded-2xl border border-primary/20 bg-primary/10 p-3 backdrop-blur-2xl">
      <Collapsible
        className="w-full"
        onOpenChange={() => {
          rowVirtualizer.measure()
        }}
      >
        <CollapsibleTrigger className="flex items-center justify-between font-russo text-2xl text-primary">
          <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div ref={contentRef}>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} sensors={sensors}>
              <SortableContext
                items={games.map((g) => g.slug)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mt-6 grid grid-cols-[repeat(4,max-content)] gap-4">
                  {games.map((game, idx) => (
                    <SortableGameCard game={game} index={idx} key={game.slug} />
                  ))}

                  <div className="flex items-center justify-center gap-4">
                    <GameAddButton onAddGame={onAddGame} />
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
