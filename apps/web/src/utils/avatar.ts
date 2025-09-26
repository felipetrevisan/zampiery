export const avatarStyles = [
  'adventurer',
  'adventurerNeutral',
  'avataaars',
  'avataaarsNeutral',
  'bigEars',
  'bigEarsNeutral',
  'bigSmile',
  'bottts',
  'botttsNeutral',
  'croodles',
  'croodlesNeutral',
  'dylan',
  'funEmoji',
  'glass',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'loreleiNeutral',
  'micah',
  'miniavs',
  'notionists',
  'notionistsNeutral',
  'openPeeps',
  'personas',
  'pixelArt',
  'pixelArtNeutral',
  'rings',
  'shapes',
  'thumbs',
]

export const avatarStylesArray = avatarStyles.map((name) => {
  const slug = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

  return { name, slug }
})
