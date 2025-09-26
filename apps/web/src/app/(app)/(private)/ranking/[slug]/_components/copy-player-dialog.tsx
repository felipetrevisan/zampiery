import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nathy/shared/ui/animated/dialog'
import { HighlightText } from '@nathy/shared/ui/animated/text/highlight'
import { Button } from '@nathy/shared/ui/button'
import { Separator } from '@nathy/shared/ui/separator'
import type { Player } from '@nathy/web/types/player'
import { useState } from 'react'
import { toast } from 'sonner'

interface CopyPlayerDialogProps {
  onClose: () => void
  players: Player[]
}

export function CopyPlayerDialog({ onClose, players }: CopyPlayerDialogProps) {
  const [isCopied, setIsCopied] = useState(false)

  const names = players?.map((person) => person.name)
  const formatted =
    names.length > 1
      ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
      : (names[0] ?? '')

  const copyNames = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(formatted)

    toast.success('Nomes copiado na área de transferencia')
  }

  const closeDialog = () => {
    setIsCopied(false)
    onClose()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Copiar Lista</DialogTitle>
        <Separator className="h-6" orientation="horizontal" />
      </DialogHeader>
      <div className="mt-5">
        <div className="grid gap-4">
          <div className="grid gap-3">
            {isCopied ? (
              <HighlightText text={formatted} />
            ) : (
              <span className="text-xl">{formatted}</span>
            )}
          </div>
        </div>
      </div>
      <Separator className="h-6" orientation="horizontal" />
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={closeDialog} variant="outline">
            Fechar
          </Button>
        </DialogClose>
        <Button onClick={copyNames}>Copiar</Button>
      </DialogFooter>
    </DialogContent>
  )
}
