const enOrdinalRules = new Intl.PluralRules('pt-BR', { type: 'ordinal' })

const suffixes = new Map([
  ['one', 'º'],
  ['two', 'º'],
  ['few', 'º'],
  ['other', 'º'],
])

export const formatOrdinals = (number: number) => {
  const rule = enOrdinalRules.select(number)
  const suffix = suffixes.get(rule)
  return `${number}${suffix}`
}
