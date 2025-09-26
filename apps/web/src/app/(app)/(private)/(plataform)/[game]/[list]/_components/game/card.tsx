'use client'

import { cn } from '@nathy/shared/lib/utils'
import { toggleGameStatus } from '@nathy/web/server/grouped-list'
import type { Game, GameStatus } from '@nathy/web/types/game'
import { motion } from 'motion/react'
import { useState } from 'react'

type GameCardProps = {
  game: Game
  index?: number
  className: string
}

export function GameCard({ game, className }: GameCardProps) {
  const [status, setStatus] = useState<GameStatus>(
    game.played ? 'played' : game.cancelled ? 'cancelled' : 'none',
  )
  const [players, _setPlayers] = useState(game.players)

  async function handleToggleStatus() {
    let newStatus: GameStatus

    if (status === 'none') {
      newStatus = 'played'
    } else if (status === 'played') {
      newStatus = 'cancelled'
    } else {
      newStatus = 'none'
    }

    setStatus(newStatus)

    try {
      await toggleGameStatus(game.id, newStatus)
    } catch (_err) {
      // rollback se falhar
      setStatus(status)
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        animate="initial"
        className={cn(
          'group flex w-[400px] cursor-pointer flex-col items-center justify-between rounded-full border-1 bg-background/80 p-3 shadow-lg backdrop-blur-2xl hover:border-primary',
          {
            'border-lime-400 bg-lime-400/30 hover:border-lime-500': status === 'played',
            'dark:hover:neutral-800/90 dark:border-neutral-800/80 dark:bg-neutral-800/50':
              status === 'none',
            'border-red-400 bg-red-400/30 hover:border-red-500': status === 'cancelled',

            // 'bg-neutral-800/10':
            //   !isPlayed && (!players.home.attendance || !players.guest.attendance),
          },
          className,
        )}
        initial="initial"
        onClick={handleToggleStatus}
        whileHover="hovered"
      >
        <div className="flex items-center justify-between gap-10 py-4 text-xl">
          <div className="flex items-center gap-2">
            <span
              className={cn('text-primary', {
                'text-lime-400': status === 'played',
                'text-red-400': status === 'cancelled',
              })}
            >
              {players.home?.player.name}
            </span>
            <span
              className={cn('font-russo text-4xl text-primary', {
                'text-lime-400': status === 'played',
                'text-red-400': status === 'cancelled',
              })}
            >
              {game.players?.home?.score ?? '-'}
            </span>
          </div>

          <span
            className={cn('font-russo text-4xl text-primary', {
              'text-lime-400': status === 'played',
              'text-red-400': status === 'cancelled',
            })}
          >
            X
          </span>

          <div className="flex items-center gap-2">
            <span
              className={cn('font-russo text-4xl text-primary', {
                'text-lime-400': status === 'played',
                'text-red-400': status === 'cancelled',
              })}
            >
              {game.players?.guest?.score ?? '-'}
            </span>
            <span
              className={cn('text-primary', {
                'text-lime-400': status === 'played',
                'text-red-400': status === 'cancelled',
              })}
            >
              {players.guest?.player.name}
            </span>
          </div>
        </div>
        {/* {!isPlayed && (
          <motion.div
            className={cn(
              'pointer-events-none flex items-center justify-between gap-22',
              'absolute bottom-0 group-hover:pointer-events-auto',
            )}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            variants={{
              initial: { opacity: 0 },
              hovered: { opacity: 1 },
            }}
          >
            <AttendanceToggle
              gameId={game.id}
              initial={
                game.players.home.attendance === null
                  ? 'indeterminate'
                  : game.players.home.attendance
                    ? 'present'
                    : 'absent'
              }
              player={1}
            />
            <AttendanceToggle
              gameId={game.id}
              initial={
                game.players.guest.attendance === null
                  ? 'indeterminate'
                  : game.players.guest.attendance
                    ? 'present'
                    : 'absent'
              }
              player={2}
            />
          </motion.div>
        )} */}
      </motion.div>
    </div>
  )
}
