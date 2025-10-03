'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { getFormationsQuery } from '@nathy/web/client/queries/formation'
import type { Formation } from '@nathy/web/types/formation'

export async function getFormations() {
  return sanityFetch<Formation[]>({ query: getFormationsQuery })
}
