'use client'

import { DropdownMenu, DropdownMenuTrigger } from '@nathy/shared/ui/animated/dropdown-menu'
import {
  Sidebar as BaseSidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@nathy/shared/ui/animated/sidebar'
import { ChevronsUpDown, Command } from 'lucide-react'
import { useSettings } from '../hooks/use-settings'
import { SidebarNavigation } from './sidebar/navigation'

export function Sidebar() {
  const { data: settings } = useSettings()

  return (
    <BaseSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar"
                  size="lg"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{settings?.title}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarNavigation />
      <SidebarRail />
    </BaseSidebar>
  )
}
