import { normalize } from './normalize.js'

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phraseRegExp(phrase) {
  const normalized = normalize(phrase)
  if (!normalized) return null
  const escaped = normalized.split(' ').map(escapeRegExp).join('\\s+')
  return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'u')
}

export function termMatches(term, normalizedText) {
  const phrases = [term.label, ...(term.aliases || [])]
  if (phrases.some((phrase) => {
    const re = phraseRegExp(phrase)
    return re ? re.test(normalizedText) : false
  })) {
    return true
  }

  if (term.regex) {
    try {
      const re = new RegExp(term.regex, 'iu')
      return re.test(normalizedText)
    } catch {
      return false
    }
  }

  return false
}

export function matchTerms(text, terms) {
  const normalizedText = normalize(text)
  return terms
    .filter((term) => termMatches(term, normalizedText))
    .map((term) => term.id)
}
