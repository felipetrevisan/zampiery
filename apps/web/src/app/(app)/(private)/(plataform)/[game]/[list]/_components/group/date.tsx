import { closestCenter, DndContext, type DragEndEvent, type useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@nathy/shared/lib/utils'
import { Collapsible, CollapsibleContent } from '@nathy/shared/ui/animated/collapsible'
import type { Game } from '@nathy/web/types/game'
import { format, isToday, parse } from 'date-fns'
import { useRef } from 'react'
import { GameAddButton } from '../game/add-button'
import { GameCard } from '../game/card'

export function DateGroup({
  date,
  games,
  sensors,
  onDragEnd,
  onAddGame,
}: {
  date: string
  games: Game[]
  sensors: ReturnType<typeof useSensors>
  onDragEnd: (e: DragEndEvent) => void
  onAddGame: () => void
}) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())

  function SortableGameCard({ game, index }: { game: Game; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: game.id,
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
    <div className="flex w-full flex-col">
      <Collapsible className="w-full" open={true}>
        {!isToday(parsedDate) && (
          <div className="flex items-center justify-between font-russo text-2xl text-primary">
            <span>{format(parsedDate, 'dd/MM/yyyy')}</span>
          </div>
        )}

        <CollapsibleContent>
          <div ref={contentRef}>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} sensors={sensors}>
              <SortableContext
                items={games.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mt-6 grid grid-cols-[repeat(4,max-content)] gap-4">
                  {games.map((game, idx) => (
                    <SortableGameCard game={game} index={idx} key={game.id} />
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
