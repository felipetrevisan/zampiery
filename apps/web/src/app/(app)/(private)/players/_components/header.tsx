'use client'

import BlobButton from '@nathy/shared/ui/animated/button/blob-button'
import { Dialog, DialogTrigger } from '@nathy/shared/ui/animated/dialog'
import { CirclePlus } from '@nathy/shared/ui/animated/icons/circle-plus'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { PlayerFormSchema } from '@nathy/web/config/schemas/player'
import type { Player } from '@nathy/web/types/player'
import { avatarStylesArray } from '@nathy/web/utils/avatar'
import { buildAvatarUrl } from '@nathy/web/utils/random-avatar'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddPlayerDialog } from './add-player-dialog'

interface HeaderProps {
  onSubmit: () => void
  onEdit: () => void
  onSelectPlayer: (player: Player | null) => void
  onDialogOpen: Dispatch<SetStateAction<boolean>>
  selectedPlayer: Player | null
  isDialogOpen: boolean
  playersTotalCount: number
}

export function Header({
  onSubmit,
  onEdit,
  onDialogOpen,
  onSelectPlayer,
  isDialogOpen,
  selectedPlayer,
  playersTotalCount = 0,
}: HeaderProps) {
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext<PlayerFormSchema>()
  const [avatarSeed, setAvatarSeed] = useState(getAvatarRandomSeed)
  const [avatarStyle, setAvatarStyle] = useState(getAvatarRandomStyle)

  function getAvatarRandomStyle() {
    return avatarStylesArray[Math.floor(Math.random() * avatarStylesArray.length)]
  }

  function getAvatarRandomSeed() {
    return crypto.randomUUID()
  }

  function handleSubmit() {
    if (selectedPlayer) {
      onEdit()
    } else {
      onSubmit()
    }

    onDialogOpen(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!isDialogOpen) {
      reset()
    }

    if (selectedPlayer) {
      reset({
        name: selectedPlayer.name,
        avatar:
          selectedPlayer.avatar ??
          buildAvatarUrl({
            seed: avatarSeed,
            size: 128,
            style: avatarStyle.slug,
          }).url,
        favoritePosition: selectedPlayer.favoritePosition,
        favoriteTeam: {
          id: selectedPlayer.favoriteTeam?.id,
          name: selectedPlayer.favoriteTeam?.name,
        },
      })
    } else {
      reset({
        name: '',
        avatar: buildAvatarUrl({
          seed: avatarSeed,
          size: 128,
          style: avatarStyle.slug,
        }).url,
        favoritePosition: '',
        favoriteTeam: {
          id: '',
          name: '',
        },
      })
    }
  }, [selectedPlayer, isDialogOpen, reset])

  return (
    <BaseHeader showTotalCount title="Jogadores" totalCount={playersTotalCount}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />

        <Dialog onOpenChange={onDialogOpen} open={isDialogOpen}>
          <form onSubmit={handleSubmit}>
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
                <CirclePlus animate="path-loop" animateOnHover animateOnTap />
                <span className="hidden md:block">Adicionar Novo Jogador</span>
              </BlobButton>
            </DialogTrigger>
            <AddPlayerDialog
              avatarSeed={avatarSeed}
              avatarStyle={avatarStyle}
              onAvatarSeed={getAvatarRandomSeed}
              onAvatarStyle={getAvatarRandomStyle}
              onSetAvatarSeed={setAvatarSeed}
              onSetAvatarStyle={setAvatarStyle}
              onSubmit={handleSubmit}
              selectedPlayer={selectedPlayer}
            />
          </form>
        </Dialog>
      </div>
    </BaseHeader>
  )
}
