'use server'

import { client } from '@nathy/web/client/client'
import { sanityFetch } from '@nathy/web/client/fetch'
import { getSettingsQuery } from '@nathy/web/client/queries'
import { env } from '@nathy/web/config/env'
import type { Settings } from '@nathy/web/types/settings'

const getClient = () => client.withConfig({ token: env.SANITY_API_WRITE_TOKEN, useCdn: false })

export async function getSettings() {
  return sanityFetch<Settings>({ query: getSettingsQuery })
}

export async function mutateUpdateSettings(settings: Settings) {
  await getClient().createIfNotExists({ _id: 'settings', _type: 'settings' })

  return await getClient()
    .patch('settings')
    .set({
      title: settings.title,
      theme: {
        schema: settings.theme.schema,
        color: settings.theme.color,
      },
      backgroundEffect: settings.backgroundEffect
    })
    .commit({ autoGenerateArrayKeys: true })
}
