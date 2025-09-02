'use client'

import { cn } from '@nathy/shared/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@nathy/shared/ui/animated/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@nathy/shared/ui/animated/tooltip'
import { mutateToggleAttendance } from '@nathy/web/server/grouped-list'
import type { Attendance } from '@nathy/web/types/game'
import { useMutation } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AttendanceToggle({
  gameId,
  player,
  initial = 'indeterminate',
}: {
  gameId: string
  player: 1 | 2
  initial?: Attendance
}) {
  const [value, setValue] = useState<Attendance>(initial)

  const mutation = useMutation({
    mutationFn: ({
      gameId,
      player,
      attendance,
    }: {
      gameId: string
      player: 1 | 2
      attendance: Attendance
    }) => mutateToggleAttendance({ gameId, player, attendance }),
    onSuccess: () => {
      toast.success(`Jogador ${player} compareceu a partida!`)
    },
  })

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const options: { label: string; value: Attendance; icon: any; color: string }[] = [
    {
      label: 'Presente',
      value: 'present',
      icon: Check,
      color: 'bg-secondary text-secondary-foreground',
    },
    {
      label: 'Ausente',
      value: 'absent',
      icon: X,
      color: 'bg-destructive text-destructive-foreground',
    },
  ]

  return (
    <div className="flex gap-2">
      <ToggleGroup type="single" defaultValue="indeterminate">
        {options.map((opt) => {
          const Icon = opt.icon
          const isActive = value === opt.value

          return (
            <Tooltip key={opt.value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={opt.value}
                  disabled={mutation.isPending || value === opt.value}
                  className={cn('flex items-center gap-1 rounded-full px-3 py-1 transition', {
                    'bg-muted hover:bg-muted': !isActive,
                    [opt.color]: isActive,
                    'cursor-not-allowed opacity-50': mutation.isPending,
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    mutation.mutate({ gameId, player, attendance: opt.value })
                  }}
                >
                  <Icon className="h-4 w-4 font-bold" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="right">
                {opt.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </ToggleGroup>
    </div>
  )
}
