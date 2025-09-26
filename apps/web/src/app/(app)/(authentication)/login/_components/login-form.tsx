'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@nathy/shared/lib/utils'
import { Button } from '@nathy/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nathy/shared/ui/card'
import { Input } from '@nathy/shared/ui/input'
import { Label } from '@nathy/shared/ui/label'
import { EyeIcon } from '@nathy/web/components/animated-password/eye-icon'
import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const loginFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type LoginSchema = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setError(null)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (!res) {
        setError('Não foi possível conectar. Tente novamente.')
        toast.error('Não foi possível conectar. Tente novamente.')
        return
      }

      if (res.error) {
        setError('Credenciais inválidas')
        toast.error('Credenciais inválidas')
        return
      }

      toast.success('Login realizado com sucesso!')
      router.replace('/')
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.')
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-2xl bg-card/50 shadow-md">
      <Card className="bg-transparent">
        <CardHeader className="text-center font-bold font-inter">
          <CardTitle className="text-2xl">Entre no Zampiery App</CardTitle>
          <CardDescription>Digite seu login e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="relative grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="Seu melhor e-mail"
                  required
                  type="email"
                  {...register('email')}
                  className={`peer scale-100 transition-all ease-in-out focus:scale-110 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
              <motion.div
                animate={{ marginTop: errors.email ? 60 : 0 }}
                className="relative grid gap-3"
                exit={{ marginTop: 0 }}
                initial={{ marginTop: 0 }}
              >
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Sua senha"
                    required
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...register('password')}
                    className={`peer scale-100 transition-all ease-in-out focus:scale-110 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="-translate-y-1/2 absolute top-1/2 right-3">
                    <motion.button
                      aria-label={!isPasswordVisible ? 'Show password' : 'Hide password'}
                      aria-pressed={isPasswordVisible}
                      className={cn(
                        'flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500',
                        {
                          'text-neutral-600 dark:text-neutral-400': !isPasswordVisible,
                          'text-neutral-900 dark:text-neutral-100': isPasswordVisible,
                        },
                      )}
                      onClick={() => {
                        setIsPasswordVisible(!isPasswordVisible)
                      }}
                      transition={{ type: 'spring', bounce: 0 }}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <EyeIcon open={isPasswordVisible} size={20} />
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="repeat-1 absolute top-13 left-0 mt-1 w-full rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        key="password-error"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-primary/50 p-4 text-primary-foreground text-sm"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: -10 }}
                    key="global-error"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.div
                animate={{ marginTop: errors.password ? 60 : 0 }}
                className="flex flex-col gap-3"
                exit={{ marginTop: 0 }}
                initial={{ marginTop: 0 }}
              >
                <Button className="w-full" disabled={isSubmitting || !isValid} type="submit">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Entrar'}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
