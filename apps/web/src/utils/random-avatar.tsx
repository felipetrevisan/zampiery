import * as collection from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

const DICEBEAR_API = 'https://api.dicebear.com'
const DICEBEAR_API_VERSION = '9.x'

export function buildAvatarImage({
  seed,
  style = 'bottts',
  size = 64,
}: {
  seed?: string
  style?: string
  size?: number
}) {
  // biome-ignore lint/suspicious/noExplicitAny: false positive
  const randomStyle = (collection as any)[style]

  const avatar = createAvatar(randomStyle, {
    seed: seed ?? crypto.randomUUID(),
    size,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
  })

  return avatar
}

export function buildAvatarUrl({
  seed,
  style = 'bottts',
  size = 64,
}: {
  seed?: string
  style?: string
  size?: number
}) {
  const finalSeed = seed ?? crypto.randomUUID()
  const finalStyle = style

  const avatarURL = buildDicebearUrl({
    seed: finalSeed,
    style: finalStyle,
    size,
    background: 'c0aede,d1d4f9,ffd5dc,ffdfbf',
  })

  return {
    url: avatarURL,
    seed: finalSeed,
    style: finalStyle,
  }
}

export function RandomAvatar({ avatar }: { avatar: string }) {
  return (
    <div
      className="overflow-hidden rounded-full"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: false positive
      dangerouslySetInnerHTML={{ __html: avatar.toString() }}
    />
  )
}

export function buildDicebearUrl({
  style,
  seed,
  size,
  background,
}: {
  style: string
  seed: string
  size: number
  background?: string
}) {
  return `${DICEBEAR_API}/${DICEBEAR_API_VERSION}/${style}/svg?seed=${seed}&size=${size}${background ? `&backgroundColor=${background}` : ''}`
}

export function getDicebearUrl({ url, background }: { url: string; background?: string }) {
  return `${url}${background ? `&backgroundColor=${background}` : ''}`
}
