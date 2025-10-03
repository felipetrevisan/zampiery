'use client'

import type { Position } from '@nathy/web/types/formation'

interface FormationTableProps {
  positions: Position[]
}

export default function FormationTable({ positions }: FormationTableProps) {
  return (
    <div className='absolute flex flex-col items-center gap-4'>
      <div className="relative z-10 space-y-3">
        {positions.map((p) => (
          <div className="flex items-center justify-between gap-5 rounded-2xl bg-neutral-200 p-2 dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-background p-2">{p.role}</div>
              <div>
                <div className="font-semibold text-sm">{p.player?.name ?? 'Sem jogador'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
