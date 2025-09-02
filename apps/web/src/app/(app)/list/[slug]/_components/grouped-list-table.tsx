'use client'

import { cn } from '@nathy/shared/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useState } from 'react'
import { GameAddButton } from './game/add-button'
// import { ConfirmDeleteAlert } from './confirm-delete'
import { GameCard } from './game/card'

interface TableProps {
  list: GroupedList
}

export function GroupedListTable({ list }: TableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGameDate, setSelectedDateGame] = useState<string | null>(null)

  const groupedByDate = list.games?.reduce((acc: Record<string, typeof list.games>, game) => {
    if (!game?.date) return acc

    if (!acc[game.date]) {
      acc[game.date] = []
    }

    acc[game.date].push(game)
    return acc
  }, {})

  function handleAddGameDialog(date: string) {
    setSelectedDateGame(date)
    setIsDialogOpen(true)
  }

  return (
    <>
      {!list.games?.length && (
        <div className="group space-y-6 rounded-2xl border-1 border-primary/20 bg-primary/20 p-3 backdrop-blur-2xl">
          <div className="p-10">
            <div className="flex items-center justify-center space-x-2 font-bold text-primary text-xl">
              Nenhum jogo encontrado
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {list.games?.length > 0 &&
          Object.entries(groupedByDate)?.map(([date, games]) => (
            <div
              className={cn(
                'flex w-full justify-between rounded-2xl border-1 border-primary/20 bg-primary/10 p-3 backdrop-blur-2xl',
              )}
              key={date}
            >
              <Collapsible className="w-full">
                <CollapsibleTrigger className='flex items-center justify-between font-russo text-2xl text-primary'>
                  <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-10 grid grid-cols-[repeat(4,max-content)] gap-4">
                    {games.map((game, index) => (
                      <GameCard key={game.slug} game={game} index={index} />
                    ))}
                    <div className="flex items-center justify-center gap-4">
                      <GameAddButton onAddGame={() => handleAddGameDialog(date)} />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
      </div>
      {/* <AddGameDialog
        dialogOpen={isDialogOpen}
        onDialogOpen={setIsDialogOpen}
        onSubmit={() => null}
        selectedGameDate={selectedGameDate}
        selectedList={list}
      /> */}
      {/* <ConfirmDeleteAlert deleteId={deleteId} onSetDeleteId={setDeleteId} onDelete={onDelete} /> */}
    </>
  )
}
