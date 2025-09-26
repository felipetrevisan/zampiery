import { client } from '../client/client'
import { env } from './env'

type ClientType = 'read' | 'write'

const clients: Partial<Record<ClientType, ReturnType<typeof client.withConfig>>> = {}

export const getClient = (type: ClientType = 'read') => {
  if (!clients[type]) {
    if (type === 'write') {
      clients[type] = client.withConfig({
        token: env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
      })
    } else {
      clients[type] = client.withConfig({
        useCdn: true,
      })
    }
  }

  // biome-ignore lint/style/noNonNullAssertion: false positive
  return clients[type]!
}
