'use client'

import { cn } from '@nathy/shared/lib/utils'
import { IconButton } from '@nathy/shared/ui/animated/button/icon-button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nathy/shared/ui/animated/dialog'
import { Button } from '@nathy/shared/ui/button'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { Separator } from '@nathy/shared/ui/separator'
import type { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword, updateEmail, updateProfile } from 'firebase/auth'
import { Loader2Icon, RefreshCcwIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { auth } from '../config/firebase'
import type { UpdateUserProfileFormSchema } from '../config/schemas/profile'
import { avatarStylesArray } from '../utils/avatar'
import { buildAvatarUrl } from '../utils/random-avatar'
import { EyeIcon } from './animated-password/eye-icon'

const MotionDialogFooter = motion(DialogFooter)

interface Props {
  isDialogOpen: boolean
}

export function ProfileDialog({ isDialogOpen }: Props) {
  const { data: session } = useSession()
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false)
  const [avatarSeed, setAvatarSeed] = useState(getAvatarRandomSeed)
  const [avatarStyle, setAvatarStyle] = useState(getAvatarRandomStyle)

  const {
    register,
    setError,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<UpdateUserProfileFormSchema>()

  async function handleUpdateProfile(userProfile: UpdateUserProfileFormSchema) {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        // biome-ignore lint/style/noNonNullAssertion: false positive
        session?.user?.email!,
        userProfile.currentPassword,
      )

      if (userProfile.name && userProfile.name !== user.displayName) {
        await updateProfile(user, { displayName: userProfile.name })
      }

      if (avatar) {
        await updateProfile(user, { photoURL: avatar.url })
      }

      if (userProfile.email && userProfile.email !== user.email) {
        await updateEmail(user, userProfile.email)
      }

      await user.reload()

      toast.success('Seu perfil foi atualizado com sucesso')
    } catch (err) {
      const error = err as FirebaseError
      if (error.code === 'auth/wrong-password') {
        setError('currentPassword', { message: 'Senha atual incorreta' })
      }

      toast.error('Não foi possível atualizar seu perfil. Verifique os erros e tente novamente.')
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (session?.user.name) {
      setValue('name', session.user.name)
    }

    if (session?.user.email) {
      setValue('email', session.user.email)
    }
  }, [session])

  function getAvatarRandomStyle() {
    return avatarStylesArray[Math.floor(Math.random() * avatarStylesArray.length)]
  }

  function getAvatarRandomSeed() {
    return crypto.randomUUID()
  }

  function handleRefreshAvatar() {
    setAvatarSeed(getAvatarRandomSeed())
    setAvatarStyle(getAvatarRandomStyle())
  }

  const avatar = buildAvatarUrl({
    seed: avatarSeed,
    size: 128,
    style: avatarStyle.slug,
  })

  useEffect(() => {
    if (!isDialogOpen) {
      reset()
    }
  }, [isDialogOpen, reset])

  return (
    <form onSubmit={handleSubmit(handleUpdateProfile)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Perfil</DialogTitle>
          <Separator className="h-6" orientation="horizontal" />
        </DialogHeader>
        <div className="mt-5">
          <div className="grid gap-4">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="relative">
                <div
                  className="size-32 rounded-full bg-cover"
                  style={{ backgroundImage: `url(${session?.user.image ?? avatar.url})` }}
                />
                <IconButton
                  className="absolute top-0"
                  icon={RefreshCcwIcon}
                  onClick={handleRefreshAvatar}
                />
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-3">
              <div className="relative flex flex-col gap-3">
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
              <div className="relative flex flex-col gap-3">
                <Label>E-mail</Label>
                <Input
                  {...register('email')}
                  className={`peer ${errors.email ? 'border-red-500' : ''}`}
                  required
                  type="email"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: -10 }}
                      key="email-error"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <motion.div
              animate={{ marginTop: errors.name || errors.email ? 60 : 0 }}
              className="relative grid gap-3"
              exit={{ marginTop: 0 }}
              initial={{ marginTop: 0 }}
            >
              <Label>Senha Atual</Label>
              <Input
                {...register('currentPassword')}
                className={`peer ${errors.currentPassword ? 'border-red-500' : ''}`}
                required
                type={isCurrentPasswordVisible ? 'text' : 'password'}
              />
              <div className="-translate-y-1/2 absolute top-[68%] right-3">
                <motion.button
                  aria-label={!isCurrentPasswordVisible ? 'Show password' : 'Hide password'}
                  aria-pressed={isCurrentPasswordVisible}
                  className={cn(
                    'flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500',
                    {
                      'text-neutral-600 dark:text-neutral-400': !isCurrentPasswordVisible,
                      'text-neutral-900 dark:text-neutral-100': isCurrentPasswordVisible,
                    },
                  )}
                  onClick={() => {
                    setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                  }}
                  transition={{ type: 'spring', bounce: 0 }}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeIcon open={isCurrentPasswordVisible} size={20} />
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.currentPassword && (
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: -10 }}
                    key="currentPassword-error"
                  >
                    {errors.currentPassword.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        <MotionDialogFooter
          animate={{ marginTop: errors.currentPassword ? 80 : 0 }}
          exit={{ marginTop: 0 }}
          initial={{ marginTop: 0 }}
        >
          <DialogClose asChild>
            <Button disabled={isSubmitting} variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={isSubmitting || !isValid}
            onClick={handleSubmit(handleUpdateProfile)}
            type="submit"
          >
            {isSubmitting ? <Loader2Icon /> : 'Salvar'}
          </Button>
        </MotionDialogFooter>
      </DialogContent>
    </form>
  )
}
