import { IconButton } from '@nathy/shared/ui/animated/button/icon-button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nathy/shared/ui/animated/dialog'
import { CheckCheck } from '@nathy/shared/ui/animated/icons/check-check'
import { LoaderPinwheel } from '@nathy/shared/ui/animated/icons/loader-pinwheel'
import { Switch } from '@nathy/shared/ui/animated/switch'
import { Button } from '@nathy/shared/ui/button'
import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { Separator } from '@nathy/shared/ui/separator'
import type { PlayerFormSchema } from '@nathy/web/config/schemas/player'
import { useTeam } from '@nathy/web/hooks/use-team'
import { type Player, PlayerPosition, PlayerPositionLabels } from '@nathy/web/types/player'
import { buildAvatarUrl, getDicebearUrl } from '@nathy/web/utils/random-avatar'
import { RefreshCcwIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Controller, useFormContext } from 'react-hook-form'

interface AddPlayerDialogProps {
  onSubmit: () => void
  onSetAvatarSeed: (seed: string) => void
  onSetAvatarStyle: (style: { name: string; slug: string }) => void
  onAvatarSeed: () => string
  onAvatarStyle: () => { name: string; slug: string }
  selectedPlayer: Player | null
  avatarSeed: string
  avatarStyle: { name: string; slug: string }
}

export function AddPlayerDialog({
  onSubmit,
  onSetAvatarSeed,
  onSetAvatarStyle,
  onAvatarSeed,
  onAvatarStyle,
  avatarSeed,
  avatarStyle,
  selectedPlayer,
}: AddPlayerDialogProps) {
  function handleRefreshAvatar() {
    onSetAvatarSeed(onAvatarSeed())
    onSetAvatarStyle(onAvatarStyle())

    const avatar = buildAvatarUrl({
      seed: avatarSeed,
      size: 128,
      style: avatarStyle.slug,
    })

    setValue('avatar', avatar.url)
  }

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<PlayerFormSchema>()

  const { data, isLoading } = useTeam()

  const avatarUrl = watch('avatar')

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{selectedPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}</DialogTitle>
        <Separator className="h-6" orientation="horizontal" />
      </DialogHeader>
      <div className="mt-5">
        <div className="grid gap-4">
          <div className="flex flex-row items-center justify-center gap-3">
            <div className="relative">
              <div
                className="size-32 rounded-full bg-cover"
                style={{
                  backgroundImage: `url(${
                    avatarUrl ??
                    getDicebearUrl({
                      // biome-ignore lint/style/noNonNullAssertion: false positive
                      url: selectedPlayer?.avatar!,
                      background: 'c0aede,d1d4f9,ffd5dc,ffdfbf',
                    })
                  })`,
                }}
              />
              <IconButton
                className="absolute top-0"
                icon={RefreshCcwIcon}
                onClick={handleRefreshAvatar}
              />
            </div>
          </div>
          <div className="relative grid gap-3">
            <Label className="text-right" htmlFor="theme-color">
              Favorito?
            </Label>
            <Controller
              control={control}
              name="isFavorite"
              render={({ field }) => (
                <Switch
                  checked={field.value ?? false}
                  name={field.name}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                  }}
                />
              )}
            />
            <AnimatePresence>
              {errors.isFavorite && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="name-error"
                >
                  {errors.isFavorite.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="relative grid gap-3">
            <Label>Nome</Label>
            <Input
              {...register('name')}
              className={`peer ${errors.name ? 'border-red-500' : ''}`}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="name-error"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            animate={{ marginTop: errors.name ? 60 : 0 }}
            className="relative grid gap-3"
            exit={{ marginTop: 0 }}
            initial={{ marginTop: 0 }}
          >
            <Label>Posição Favorita</Label>
            <ComboboxField
              className={`peer ${errors.favoritePosition ? 'border-red-500' : ''}`}
              control={control}
              name="favoritePosition"
              options={Object.values(PlayerPosition).map((position) => {
                return { value: position, label: PlayerPositionLabels[position] }
              })}
              placeholder="Selecione uma posição"
              returnType="string"
            />
            <AnimatePresence>
              {errors.favoritePosition && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="favoritePosition-error"
                >
                  {errors.favoritePosition?.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            animate={{ marginTop: errors.favoritePosition ? 60 : 0 }}
            className="relative grid gap-3"
            exit={{ marginTop: 0 }}
            initial={{ marginTop: 0 }}
          >
            <Label>Time Favorito</Label>
            <ComboboxField
              control={control}
              disabled={isLoading || !data?.length}
              name="favoriteTeam"
              options={data?.map(({ id, name }) => {
                return { value: id, label: name }
              })}
              placeholder="Selecione um time"
              returnType="object"
            />
            <AnimatePresence>
              {errors.favoriteTeam && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="favoriteTeam-error"
                >
                  {errors.favoriteTeam?.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Separator className="h-6" orientation="horizontal" />

      <DialogFooter>
        <DialogClose asChild>
          <Button disabled={isSubmitting} variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button disabled={isSubmitting || !isValid} onClick={onSubmit} type="submit">
          {isSubmitting ? (
            <LoaderPinwheel animate="path-loop" />
          ) : (
            <>
              <CheckCheck animate="path-loop" animateOnHover animateOnTap /> Salvar
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
