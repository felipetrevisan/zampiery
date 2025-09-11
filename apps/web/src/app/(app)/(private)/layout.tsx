import { cn } from '@nathy/shared/lib/utils'
import { Sheet, SheetTrigger } from '@nathy/shared/ui/animated/sheet'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@nathy/shared/ui/animated/sidebar'
import { Button } from '@nathy/shared/ui/button'
import { AppSettingsSheet } from '@nathy/web/components/app-settings'
import { Sidebar } from '@nathy/web/components/app-sidebar'
import { Background } from '@nathy/web/components/background'
import { Settings2Icon } from 'lucide-react'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="before:absolute before:z-1 before:h-full before:w-full before:bg-background/60 before:backdrop-blur-md">
        <div className="z-10 flex gap-4">
          <SidebarTrigger className="z-10 my-4 ml-4" />
          <Sheet>
            <SheetTrigger asChild>
              <Button className={cn('my-4 size-7')} size="icon" variant="ghost">
                <Settings2Icon />
                <span className="sr-only">Open Settings</span>
              </Button>
            </SheetTrigger>
            <AppSettingsSheet side="right" />
          </Sheet>
        </div>
        <main>
          <Background />
          <div className="relative z-10 mx-4 mb-10">{children}</div>
        </main>
        <svg className="hidden" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <title>Goo filter definition</title>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                result="goo"
                values="1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 21 -7"
              />
              <feBlend in="SourceGraphic" in2="goo" result="mix" />
            </filter>
          </defs>
        </svg>
      </SidebarInset>
    </SidebarProvider>
  )
}
