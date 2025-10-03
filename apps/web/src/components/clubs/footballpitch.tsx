'use client'

import { cn } from '@nathy/shared/lib/utils'
import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import FormationTable from '@nathy/web/components/clubs/formation-table'
import type { Position } from '@nathy/web/types/formation'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'

interface FootballPitchProps {
  positions: Position[]
  onPositionsChange?: (positions: Position[]) => void
}

export default function FootballPitch({ positions, onPositionsChange }: FootballPitchProps) {
  return (
    <div className="grid w-full grid-cols-3 items-center gap-4">
      <div className="relative col-span-2 aspect-[10/13] w-full max-w-screen overflow-hidden">
        <Image
          alt=""
          className="rounded-xl object-contain"
          fill
          priority
          src="/assets/images/football-pitch.jpeg"
        />
        <AnimatePresence>
          {positions.map((p) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'absolute size-15 text-center font-semibold text-white text-xs',
                'rounded-full bg-black/80 px-2 py-1 shadow-lg backdrop-blur-2xl',
              )}
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={p.id}
              layout
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div>{p.player?.name ?? '---'}</div>
              <div className="text-neutral-400">{p.role}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div>
        <BlobButton rounded="2xl" size="lg">
          Ver Escalação
        </BlobButton>
        <FormationTable positions={positions} />
      </div>
    </div>
  )
}
