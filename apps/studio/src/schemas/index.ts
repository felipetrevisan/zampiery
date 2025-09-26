import type { SchemaTypeDefinition } from 'sanity'
import gameObject from './documents/game'
import PlatformDocument from './documents/game-platform'
import listDocument from './documents/list'
import playerDocument from './documents/player'
import rankingDocument from './documents/ranking'
import settingsDocument from './documents/settings'
import teamDocument from './documents/team'
import themeObject from './objects/theme'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settingsDocument,
    playerDocument,
    teamDocument,
    PlatformDocument,
    listDocument,
    rankingDocument,

    gameObject,
    themeObject,
  ],
}
