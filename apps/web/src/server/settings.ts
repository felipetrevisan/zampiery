'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { getSettingsQuery } from '@nathy/web/client/queries/settings'
import type { Settings } from '@nathy/web/types/settings'
import { getServerSession } from 'next-auth'
import { getClient } from '../config/sanity'

export async function getSettings() {
  return sanityFetch<Settings>({ query: getSettingsQuery })
}

export async function mutateUpdateSettings(settings: Settings) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }
  await getClient('write').createIfNotExists({ _id: 'settings', _type: 'settings' })

  return await getClient('write')
    .patch('settings')
    .set({
      title: settings.title,
      theme: {
        schema: settings.theme.schema,
        color: settings.theme.color,
      },
      showBackgroundEffect: settings.showBackgroundEffect,
      backgroundEffectType: settings.backgroundEffectType,
    })
    .commit({ autoGenerateArrayKeys: true })
}
