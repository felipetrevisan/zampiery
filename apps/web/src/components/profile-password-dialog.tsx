'use client'

import { cn } from '@nathy/shared/lib/utils'
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
import { signInWithEmailAndPassword, type User, updatePassword } from 'firebase/auth'
import { Loader2Icon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { auth } from '../config/firebase'
import type { UpdateUserPasswordProfileFormSchema } from '../config/schemas/profile'
import { EyeIcon } from './animated-password/eye-icon'

const MotionDialogFooter = motion(DialogFooter)

interface Props {
  isDialogOpen: boolean
}

export function ProfilePasswordDialog({ isDialogOpen }: Props) {
  const { data: session } = useSession()
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false)

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<UpdateUserPasswordProfileFormSchema>()

  async function handleUpdateProfile(userProfile: UpdateUserPasswordProfileFormSchema) {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        // biome-ignore lint/style/noNonNullAssertion: false positive
        session?.user?.email!,
        userProfile.currentPassword,
      )

      await updatePassword(user as User, userProfile.newPassword)

      toast.success('Sua senha foi atualizada com sucesso')
    } catch (err) {
      const error = err as FirebaseError

      if (error.code === 'auth/wrong-password') {
        setError('currentPassword', { message: 'Senha atual incorreta' })
      } else if (error.code === 'auth/weak-password') {
        setError('newPassword', { message: 'Senha muito fraca' })
      } else if (error.code === 'auth/requires-recent-login') {
        setError('currentPassword', {
          message: 'Reautenticação necessária. Faça login novamente.',
        })
      } else {
        setError('newPassword', {
          message: error.message ?? 'Erro ao atualizar sua senha',
        })
      }

      toast.error('Não foi possível atualizar sua senha. Verifique os erros e tente novamente.')
    }
  }

  useEffect(() => {
    if (!isDialogOpen) {
      reset()
    }
  }, [isDialogOpen, reset])

  return (
    <form onSubmit={handleSubmit(handleUpdateProfile)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Senha</DialogTitle>
          <Separator className="h-6" orientation="horizontal" />
        </DialogHeader>
        <div className="mt-5">
          <div className="grid gap-4">
            {session?.user.image && (
              <div className="flex flex-row items-center justify-center gap-3">
                <div className="relative">
                  <div
                    className="size-32 rounded-full bg-cover"
                    style={{ backgroundImage: `url(${session?.user.image})` }}
                  />
                </div>
              </div>
            )}
            <div className="relative gap-3">
              <Label>Senha Atual</Label>
              <Input
                {...register('currentPassword')}
                className={`peer ${errors.currentPassword ? 'border-red-500' : ''}`}
                required
                type={isCurrentPasswordVisible ? 'text' : 'password'}
              />
              <div className="-translate-y-1/2 absolute top-1/2 right-3">
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
            </div>
            <motion.div
              animate={{ marginTop: errors.currentPassword ? 60 : 0 }}
              className="relative grid grid-cols-2 gap-3"
              exit={{ marginTop: 0 }}
              initial={{ marginTop: 0 }}
            >
              <div className="relative flex flex-col gap-3">
                <Label>Senha Nova</Label>
                <Input
                  {...register('newPassword')}
                  className={`peer ${errors.newPassword ? 'border-red-500' : ''}`}
                  required
                  type={isNewPasswordVisible ? 'text' : 'password'}
                />
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <motion.button
                    aria-label={!isNewPasswordVisible ? 'Show password' : 'Hide password'}
                    aria-pressed={isNewPasswordVisible}
                    className={cn(
                      'flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500',
                      {
                        'text-neutral-600 dark:text-neutral-400': !isNewPasswordVisible,
                        'text-neutral-900 dark:text-neutral-100': isNewPasswordVisible,
                      },
                    )}
                    onClick={() => {
                      setIsNewPasswordVisible(!isNewPasswordVisible)
                    }}
                    transition={{ type: 'spring', bounce: 0 }}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EyeIcon open={isNewPasswordVisible} size={20} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {errors.newPassword && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: -10 }}
                      key="newPassword-error"
                    >
                      {errors.newPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative flex flex-col gap-3">
                <Label>Confirme Senha Nova</Label>
                <Input
                  {...register('confirmNewPassword')}
                  className={`peer ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                  required
                  type={isConfirmNewPasswordVisible ? 'text' : 'password'}
                />
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <motion.button
                    aria-label={!isConfirmNewPasswordVisible ? 'Show password' : 'Hide password'}
                    aria-pressed={isConfirmNewPasswordVisible}
                    className={cn(
                      'flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500',
                      {
                        'text-neutral-600 dark:text-neutral-400': !isConfirmNewPasswordVisible,
                        'text-neutral-900 dark:text-neutral-100': isConfirmNewPasswordVisible,
                      },
                    )}
                    onClick={() => {
                      setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)
                    }}
                    transition={{ type: 'spring', bounce: 0 }}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EyeIcon open={isConfirmNewPasswordVisible} size={20} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {errors.confirmNewPassword && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="repeat-1 absolute top-20 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: -10 }}
                      key="confirmNewPassword-error"
                    >
                      {errors.confirmNewPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
        <MotionDialogFooter
          animate={{ marginTop: errors.newPassword || errors.confirmNewPassword ? 80 : 0 }}
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
