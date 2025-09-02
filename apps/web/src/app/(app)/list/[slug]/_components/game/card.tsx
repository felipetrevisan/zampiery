'use client'

import { cn } from '@nathy/shared/lib/utils'
import { toggleGamePlayed } from '@nathy/web/server/grouped-list'
import type { Game } from '@nathy/web/types/game'
import { motion } from 'motion/react'
import { useState } from 'react'
import { EditableScore } from '../editable-score'
import AttendanceToggle from './attendance-toggle'

type GameCardProps = {
  game: Game
  index: number
}

export function GameCard({ game, index }: GameCardProps) {
  const [isPlayed, setIsPlayed] = useState(game.played)
  const [players, setPlayers] = useState(game.players)

  function updateScore(gameId: string, playerId: string, newValue: number): void {
    throw new Error('Function not implemented.')
  }

  async function handleTogglePlayed() {
    const newValue = !isPlayed
    setIsPlayed(newValue)
    try {
      await toggleGamePlayed(game.id, newValue)
    } catch (err) {
      setIsPlayed(!newValue)
    }
  }

  // function updatePresence(playerId: string, playerType: 1 | 2) {
  //   setPlayers((prev) => {
  //     const next = { ...prev }
  //     for (const side of ['home', 'guest'] as const) {
  //       if (next[side].player.id === playerId) {
  //         next[side] = {
  //           ...next[side],
  //           attendance: !next[side].attendance,
  //         }
  //       }
  //     }

  //     return next
  //   })

  //   mutateToggleAttendance({
  //     gameId: game.id,
  //     player: playerType,
  //     present: playerType === 1 ? !game.players.home.attendance : !game.players.guest.attendance,
  //   })
  // }

  return (
    <div className="flex items-center justify-center gap-4">
      {/* <span className="font-russo text-5xl">{index + 1}.</span> */}
      <motion.div
        className={cn(
          'group flex w-[400px] cursor-pointer flex-col items-center justify-between rounded-full border-1 bg-background/80 p-3 shadow-lg backdrop-blur-2xl hover:border-primary',
          {
            'border-primary bg-secondary/40 hover:border-secondary': isPlayed,
            'dark:hover:neutral-800/90 dark:border-neutral-800/80 dark:bg-neutral-800/50':
              !isPlayed,
            'bg-neutral-800/10': !isPlayed && (!players.home.attendance || !players.guest.attendance),
          },
        )}
        whileHover="hovered"
        initial="initial"
        animate="initial"
        onClick={handleTogglePlayed}
      >
        {/* Linha principal: nomes, placares e X */}
        <div className="flex items-center justify-between gap-10 py-4 text-xl">
          <div className="flex items-center gap-2">
            <span className="text-primary">{players.home?.player.name}</span>
            <EditableScore
              className="font-russo text-4xl text-primary"
              value={game.players?.home?.score ?? '-'}
              onSave={(newValue) => updateScore(game.id, players?.home?.player.id, newValue)}
            />
          </div>

          <span className="font-russo text-2xl text-primary/50">X</span>

          <div className="flex items-center gap-2">
            <EditableScore
              className="font-russo text-4xl text-primary"
              value={game.players?.guest?.score ?? '-'}
              onSave={(newValue) => updateScore(game.id, players?.guest?.player.id, newValue)}
            />
            <span className="text-primary">{players.guest?.player.name}</span>
          </div>
        </div>

        {/* Linha de baixo: presenças */}
        <motion.div
          className={cn(
            'pointer-events-none flex items-center justify-between gap-22',
            'group-hover:pointer-events-auto',
          )}
          variants={{
            initial: { height: 0, opacity: 0 },
            hovered: { height: 'auto', opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <AttendanceToggle
            gameId={game.id}
            player={1}
            initial={
              game.players.home.attendance === null
                ? 'indeterminate'
                : game.players.home.attendance
                  ? 'present'
                  : 'absent'
            }
          />
          <AttendanceToggle
            gameId={game.id}
            player={2}
            initial={
              game.players.guest.attendance === null
                ? 'indeterminate'
                : game.players.guest.attendance
                  ? 'present'
                  : 'absent'
            }
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
