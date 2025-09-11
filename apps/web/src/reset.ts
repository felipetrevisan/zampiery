import 'dotenv/config'
import { client } from './client/client'

const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function fixDocRank(docId: string) {
  await writeClient.delete(docId)
  console.log(`Documento ${docId} corrigido!`)
}

fixDocRank('mebuq6EaBE5xLCmLiXLg8J')
fixDocRank('mebuq6EaBE5xLCmLiYqwSp')

// async function fixOrderableRank(typeName: string) {
//   const docs = await client.fetch(`*[_type == "${typeName}"]{_id}`)

//   for (let i = 0; i < docs.length; i++) {
//     const doc = docs[i]
//     console.log(doc)
//   }

//   console.log('Todos os documentos do tipo foram corrigidos.')
// }

// fixOrderableRank('list')
