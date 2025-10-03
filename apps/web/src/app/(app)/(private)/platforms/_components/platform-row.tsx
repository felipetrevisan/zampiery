'use client'

import { Toolbar } from '@nathy/web/components/toolbar'
import type { Platform } from '@nathy/web/types/platform'
import { urlForImage } from '@nathy/web/utils/image'
import { PencilIcon, Trash } from 'lucide-react'
import Image from 'next/image'

interface RowProps {
  onDelete: (id: string) => void
  onEdit: (platform: Platform) => void
  platform: Platform
}

export function PlatformRow({ platform, onDelete, onEdit }: RowProps) {
  return (
    <div className="flex flex-grow items-center justify-between space-x-4 px-4 py-4">
      <div className="relative hidden w-[80px] max-w-[80px] flex-shrink-0 items-center justify-center md:flex">
        {platform.logo && (
          <Image
            alt={platform.title}
            className="rounded-full"
            height={80}
            src={urlForImage(platform.logo.asset).url()}
            width={80}
          />
        )}
      </div>
      <div className="grid flex-grow grid-cols-1 items-center md:grid-cols-3">
        <div className='font-semibold text-accent-foreground group-hover:text-primary-foreground sm:text-3xl md:text-xl'>
          {platform.title}
        </div>
      </div>
      <Toolbar<Platform>
        buttons={[
          {
            icon: PencilIcon,
            label: 'Editar Plataforma',
            ariaLabel: 'edit platform',
            className:
              'bg-primary text-primary-foreground font-bold group-hover:bg-secondary group-hover:text-secondary-foreground',
            onClick: (platform) => onEdit(platform),
          },
          {
            icon: Trash,
            label: 'Deletar Plataforma',
            ariaLabel: 'delete platform',
            className: 'bg-destructive text-destructive-foreground',
            onClick: (platform) => onDelete(platform.id),
          },
        ]}
        context={platform}
      />
    </div>
  )
}
