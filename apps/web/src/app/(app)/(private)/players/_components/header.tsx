'use client'

import { Input, Label } from '@nathy/shared/ui'
import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nathy/shared/ui/animated/dialog'
import { Button } from '@nathy/shared/ui/button'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import { useTeam } from '@nathy/web/hooks/use-team'
import { type Player, PlayerPosition, PlayerPositionLabels } from '@nathy/web/types/player'
import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectPlayer: (player: Player | null) => void
  onDialogOpen: (state: boolean) => void
  selectedPlayer: Player | null
  dialogOpen: boolean
  playersTotalCount: number
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectPlayer,
  dialogOpen,
  selectedPlayer,
  playersTotalCount = 0,
}: HeaderProps) {
  const {
    register,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useFormContext()
  const { data, isLoading } = useTeam()

  function handleSubmit() {
    if (selectedPlayer) {
      onEdit()
    } else {
      onSubmit()
    }

    onDialogOpen(false)
  }

  useEffect(() => {
    if (selectedPlayer) {
      reset({
        name: selectedPlayer.name,
        favoritePosition: selectedPlayer.favoritePosition,
        favoriteTeam: selectedPlayer.favoriteTeam,
      })
    } else {
      reset({
        name: '',
        favoritePosition: '',
        favoriteTeam: '',
      })
    }
  }, [selectedPlayer, reset])

  return (
    <BaseHeader showTotalCount title="Jogadores" totalCount={playersTotalCount}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={dialogOpen}>
          <form onSubmit={onSubmit}>
            <DialogTrigger asChild>
              <BlobButton
                disabled={isSubmitting}
                onClick={() => {
                  onSelectPlayer(null)
                  onDialogOpen(true)
                }}
                rounded="2xl"
                size="lg"
                type="button"
              >
                Adicionar Novo Jogador
              </BlobButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}
                </DialogTitle>
                <Separator className="h-6" orientation="horizontal" />
              </DialogHeader>
              <div className="mt-5">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Nome</Label>
                    <Input {...register('name')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="favoritePosition">Posição Favorita</Label>
                    <ComboboxField
                      control={control}
                      name="favoritePosition"
                      options={Object.values(PlayerPosition).map((position) => {
                        return { value: position, label: PlayerPositionLabels[position] }
                      })}
                      placeholder="Selecione uma posição"
                      returnType="string"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="favoriteTeam">Time Favorito</Label>
                    <ComboboxField
                      control={control}
                      disabled={isLoading || !data?.teams.length}
                      name="favoriteTeam"
                      options={data?.teams.map(({ id, name }) => {
                        return { value: id, label: name }
                      })}
                      placeholder="Selecione um time"
                      returnType="string"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isSubmitting} variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button disabled={isSubmitting || !isValid} onClick={handleSubmit} type="submit">
                  {isSubmitting ? <Loader2Icon /> : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
