'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { getTeamsQuery } from '../client/queries/team'
import type { Team } from '../types/team'

export async function getTeams() {
  return sanityFetch<Team[]>({ query: getTeamsQuery })
}
