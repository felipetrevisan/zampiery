'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@nathy/shared/lib/utils'
import { Dialog } from '@nathy/shared/ui/animated/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nathy/shared/ui/animated/dropdown-menu'
import { Settings } from '@nathy/shared/ui/animated/icons/settings'
import { Sheet, SheetTrigger } from '@nathy/shared/ui/animated/sheet'
import { SidebarTrigger } from '@nathy/shared/ui/animated/sidebar'
import { Button } from '@nathy/shared/ui/button'
import {
  type UpdateUserPasswordProfileFormSchema,
  type UpdateUserProfileFormSchema,
  updateUserPasswordProfileForm,
  updateUserProfileForm,
} from '@nathy/web/config/schemas/profile'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AppSettingsSheet } from '../app-settings'
import { ProfileDialog } from '../profile-dialog'
import { ProfilePasswordDialog } from '../profile-password-dialog'

export function SidebarToolbar() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isProfilePasswordDialogOpen, setIsProfilePasswordDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingDialogOpen] = useState(false)
  const { data: session } = useSession()

  const profileForm = useForm<UpdateUserProfileFormSchema>({
    resolver: zodResolver(updateUserProfileForm),
    defaultValues: {
      email: session?.user?.email ?? '',
      name: session?.user?.name ?? '',
    },
    mode: 'all',
  })

  const profilePasswordForm = useForm<UpdateUserPasswordProfileFormSchema>({
    resolver: zodResolver(updateUserPasswordProfileForm),
    mode: 'all',
  })

  return (
    <>
      <div className="z-10 mx-10 flex justify-between gap-4">
        <div className="flex items-center justify-center gap-4">
          <SidebarTrigger className="z-10 my-4" />
          <Sheet onOpenChange={setIsSettingDialogOpen} open={isSettingsDialogOpen}>
            <SheetTrigger asChild>
              <Settings
                animate="path-loop"
                animateOnHover
                className="size-4 cursor-pointer hover:fill-primary"
              />
            </SheetTrigger>
            <AppSettingsSheet
              isSettingsOpen={isSettingsDialogOpen}
              onSettingsOpen={setIsSettingDialogOpen}
              side="right"
            />
          </Sheet>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={cn('my-4 size-7 cursor-pointer')} size="icon" variant="ghost">
                {session?.user?.image && (
                  <div
                    className="size-7 rounded-full bg-cover"
                    style={{ backgroundImage: `url(${session?.user?.image})` }}
                  />
                )}
                <span className="sr-only">Open Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {/* {session?.user?.image && <RandomAvatar seed={session?.user?.image } />} */}
                  {session?.user?.image && (
                    <div
                      className="size-10 rounded-full bg-cover"
                      style={{ backgroundImage: `url(${session?.user?.image})` }}
                    />
                  )}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name}</span>
                    <span className="truncate text-xs">{session?.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)}>
                  Atualizar Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsProfilePasswordDialogOpen(true)}>
                  Atualizar Senha
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await signOut({ redirect: true, callbackUrl: '/login' })
                    toast.success('Você saiu com sucesso.')
                  } catch {
                    toast.error('Não foi possível sair. Tente novamente.')
                  }
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <FormProvider {...profileForm}>
        <Dialog modal onOpenChange={setIsProfileDialogOpen} open={isProfileDialogOpen}>
          <ProfileDialog isDialogOpen={isProfileDialogOpen} />
        </Dialog>
      </FormProvider>

      <FormProvider {...profilePasswordForm}>
        <Dialog
          modal
          onOpenChange={setIsProfilePasswordDialogOpen}
          open={isProfilePasswordDialogOpen}
        >
          <ProfilePasswordDialog isDialogOpen={isProfilePasswordDialogOpen} />
        </Dialog>
      </FormProvider>
    </>
  )
}
