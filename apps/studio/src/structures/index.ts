import { CogIcon, ListIcon, UsersIcon } from '@sanity/icons'
import type { ConfigContext } from 'sanity'
import type { StructureBuilder } from 'sanity/structure'

const structure = (S: StructureBuilder, _context: ConfigContext) =>
  S.list()
    .title('Content Manager')
    .items([
      S.listItem()
        .title('Configurações')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('settings').title('Configurações')),
      S.listItem().title('Jogadores').icon(UsersIcon).child(S.documentTypeList('player')),
      S.listItem()
        .title('Listas de Ranking')
        .icon(ListIcon)
        .child(S.documentTypeList('ranking-list')),
      S.listItem().title('Listas de Jogos').icon(ListIcon).child(S.documentTypeList('list')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['player', 'ranking-list', 'list', 'settings'].includes(listItem.getId() || ''),
      ),
    ])

export default structure
