import type { SchemaTypeDefinition } from 'sanity'

import listDocument from './documents/list'
import playerDocument from './documents/player'
import rankingDocument from './documents/ranking'
import settingsDocument from './documents/settings'
import gameObject from './objects/game'
import themeObject from './objects/theme'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settingsDocument,
    playerDocument,
    listDocument,
    rankingDocument,

    gameObject,
    themeObject,
  ],
}
