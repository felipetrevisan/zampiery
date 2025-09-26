'use client'

import { Background } from '@nathy/web/components/background'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { LoginForm } from './login-form'

export function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      router.replace('/')
    }
  }, [session, status, router])

  return (
    <div className="flex w-screen flex-1 scroll-mt-20 flex-col items-center">
      <Background />

      <div className="flex flex-col overflow-hidden rounded-lg border-primary/30 bg-background bg-clip-padding md:flex-1 xl:rounded-xl">
        <div className="container relative hidden flex-1 shrink-0 items-center justify-center bg-background/80 backdrop-blur-3xl md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col justify-center p-10 text-primary lg:flex">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="relative flex h-[400px] w-[400px] items-center justify-center">
              <Image alt="" fill priority src="/assets/images/logo.png" />
            </div>
          </div>
          <div className="flex h-screen items-center justify-center lg:p-8">
            <div className="flex w-full flex-col items-center justify-center gap-6">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
