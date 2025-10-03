import type { SchemaTypeDefinition } from 'sanity'
import clubDocument from './documents/club'
import clubLineup from './documents/club-lineup'
import gameDocument from './documents/game'
import platformDocument from './documents/game-platform'
import listDocument from './documents/list'
import playerDocument from './documents/player'
import rankingDocument from './documents/ranking'
import settingsDocument from './documents/settings'
import teamDocument from './documents/team'
import clubLineupPositionObject from './objects/club-lineup-position'
import themeObject from './objects/theme'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settingsDocument,
    playerDocument,
    teamDocument,
    platformDocument,
    listDocument,
    clubDocument,
    rankingDocument,
    gameDocument,
    clubLineup,

    themeObject,
    clubLineupPositionObject,
  ],
}
