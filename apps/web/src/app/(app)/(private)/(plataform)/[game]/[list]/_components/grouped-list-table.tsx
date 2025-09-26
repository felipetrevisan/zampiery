'use client'

import { type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import type { Game } from '@nathy/web/types/game'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { isBefore, isToday, parseISO, startOfDay } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
// import { ConfirmDeleteAlert } from './confirm-delete'
import { DateGroup } from './group/date'
import { LoadingDates } from './loading-dates'

interface TableProps {
  allData: GroupedList
  isPending: boolean
  onDialogOpen: (state: boolean) => void
  onSelectedDate: (date: string | null) => void
  dialogOpen: boolean
}

export function GroupedListTable({ allData, onSelectedDate, onDialogOpen, isPending }: TableProps) {
  const [groupedByDate, setGroupedByDate] = useState<Record<string, Game[]>>({})

  useEffect(() => {
    if (!allData?.games) return

    const grouped = allData.games.reduce((acc: Record<string, Game[]>, game) => {
      if (!game?.date) return acc
      if (!acc[game.date]) acc[game.date] = []
      acc[game.date].push(game)
      return acc
    }, {})

    setGroupedByDate(grouped)
  }, [allData?.games])

  const sortedDates = useMemo(
    () =>
      Object.entries(groupedByDate).sort(
        ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
      ),
    [groupedByDate],
  )

  const today = new Date()
  const todayGames = sortedDates.filter(([date]) => isToday(parseISO(date)))
  const pastGames = sortedDates.filter(([date]) => isBefore(parseISO(date), startOfDay(today)))

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
      const oldIndex = games.findIndex((g) => g.id === active.id)
      const newIndex = games.findIndex((g) => g.id === over.id)
      updated[date] = arrayMove(games, oldIndex, newIndex)
      return updated
    })
  }

  function handleAddGameDialog(date: string) {
    onSelectedDate(date)
    onDialogOpen(true)
  }

  return (
    <div className="space-y-2">
      {isPending ? (
        <LoadingDates />
      ) : !sortedDates?.length ? (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl hover:border-accent/50 hover:bg-primary/80 dark:bg-background/50">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 text-primary-foreground">
              Nenhuma data de jogos encontrado
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Collapsible
            className="flex w-full flex-col rounded-2xl border border-primary/20 bg-primary/10 p-3 backdrop-blur-2xl"
            defaultOpen
          >
            <CollapsibleTrigger>
              <div className="flex items-center font-bold font-inter text-2xl text-accent">
                <span>Jogos de Hoje</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pt-4">
                {todayGames.map(([date, games]) => (
                  <DateGroup
                    date={date}
                    games={games}
                    key={date}
                    onAddGame={() => handleAddGameDialog(date)}
                    onDragEnd={(e) => handleDragEnd(e, date)}
                    sensors={sensors}
                  />
                ))}
                {!todayGames.length && (
                  <div className="flex items-center justify-center font-bold font-inter text-primary-foreground">
                    <span>Nenhum jogo hoje até o momento</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="flex w-full flex-col rounded-2xl border border-primary/20 bg-primary/10 p-3 backdrop-blur-2xl">
            <CollapsibleTrigger className="font-semibold text-lg">
              <div className="flex items-center font-bold font-inter text-2xl text-accent">
                <span>Jogos Passados</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pt-4">
                {pastGames.map(([date, games]) => (
                  <DateGroup
                    date={date}
                    games={games}
                    key={date}
                    onAddGame={() => handleAddGameDialog(date)}
                    onDragEnd={(e) => handleDragEnd(e, date)}
                    sensors={sensors}
                  />
                ))}
                {!pastGames.length && (
                  <div className="flex items-center justify-center font-bold font-inter text-primary-foreground">
                    <span>Nenhum jogo encontrado</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}
