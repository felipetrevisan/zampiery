import { env } from '@nathy/web/config/env'
import type { SanityDocumentLike } from 'sanity'
import { client } from './client'

interface CreateDoc {
  _type: string
  [key: string]: unknown
}

type MutationParams =
  | { type: 'create'; doc: CreateDoc }
  | { type: 'createIfNotExists'; doc: CreateDoc & { _id: string } }
  | { type: 'update'; id: string; doc: SanityDocumentLike }
  | { type: 'patch'; id: string; patchData: Record<string, unknown> }
  | { type: 'delete'; id: string }

type MutationResponse = unknown

export async function sanityMutate<T = MutationResponse>(params: MutationParams): Promise<T> {
  const writeClient = client.withConfig({
    token: env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  })

  switch (params.type) {
    case 'create':
      return (await writeClient.create(params.doc)) as T

    case 'createIfNotExists':
      return (await writeClient.createIfNotExists(params.doc)) as T

    case 'update':
      return (await writeClient.patch(params.id).set(params.doc).commit()) as T

    case 'patch':
      return (await writeClient.patch(params.id).set(params.patchData).commit()) as T

    case 'delete':
      return (await writeClient.delete(params.id)) as T

    default:
      throw new Error(
        `Tipo de mutação inválido: ${
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (params as any).type
        }`,
      )
  }
}
