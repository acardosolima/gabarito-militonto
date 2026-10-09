import { describe, expect, it } from 'vitest'
import { matchTerms, termMatches } from './match.js'
import { normalize } from './normalize.js'
import termsData from '../data/terms.json'

describe('termMatches', () => {
  it('matches the label itself', () => {
    const term = { id: 'racismo', label: 'Racismo' }
    expect(termMatches(term, normalize('isso e racismo estrutural'))).toBe(true)
  })

  it('does not match a bare substring without a word boundary', () => {
    const term = { id: 'racismo', label: 'Racismo' }
    expect(termMatches(term, normalize('antirracismo e outra palavra'))).toBe(false)
  })

  it('matches an alias phrase', () => {
    const term = { id: 'nazista', label: 'Nazista', aliases: ['nazi'] }
    expect(termMatches(term, normalize('ele chamou todo mundo de nazi'))).toBe(true)
  })

  it('matches multi-word aliases regardless of extra spacing', () => {
    const term = { id: 'golpe', label: 'Golpe', aliases: ['golpe de estado'] }
    expect(termMatches(term, normalize('isso foi um golpe   de   estado'))).toBe(true)
  })

  it('matches a stem across inflected forms, including accented ones', () => {
    const term = { id: 'misoginia', label: 'Misoginia', stems: ['misogin'] }
    expect(termMatches(term, normalize('isso e misoginia'))).toBe(true)
    expect(termMatches(term, normalize('ele e muito misógino'))).toBe(true)
    expect(termMatches(term, normalize('ela e misogina as vezes'))).toBe(true)
  })

  it('does not let a stem match an unrelated word', () => {
    const term = { id: 'misoginia', label: 'Misoginia', stems: ['misogin'] }
    expect(termMatches(term, normalize('nada a ver com o assunto'))).toBe(false)
  })

  it('matches a stem inside a prefixed compound word, not just at word-start', () => {
    const term = { id: 'fascista', label: 'Fascista', stems: ['fascis'] }
    expect(termMatches(term, normalize('a veia criptofascista que sempre esteve ali'))).toBe(true)
    expect(termMatches(term, normalize('discurso neofascista de novo'))).toBe(true)
    expect(termMatches(term, normalize('isso e antifascista, nao fascista'))).toBe(true)
    expect(termMatches(term, normalize('postura pseudofascista'))).toBe(true)
  })

  it('does not let a short stem match an unrelated "-cracia" word', () => {
    const democracia = { id: 'democracia', label: 'Democracia', stems: ['democr'] }
    const racismo = { id: 'racismo', label: 'Racismo', stems: ['racis'] }
    expect(termMatches(democracia, normalize('isso e uma autocracia de novo'))).toBe(false)
    expect(termMatches(racismo, normalize('burocracia estatal de novo'))).toBe(false)
  })

  it('does not let a short "ditadura" root collide with unrelated "credit-" words', () => {
    // A short root like "ditad" would match "creditado"/"creditar" ("cre-DITAD-o"),
    // which is why ditadura uses full-word stems instead of a shared short prefix.
    const ditadura = { id: 'ditadura', label: 'Ditadura', stems: ['ditadura', 'ditador', 'ditatorial'] }
    expect(termMatches(ditadura, normalize('o valor ja foi creditado na conta'))).toBe(false)
    expect(termMatches(ditadura, normalize('vamos creditar o pagamento amanha'))).toBe(false)
  })

  it('falls back to a custom regex when provided', () => {
    const term = { id: 'number-shout', label: 'Number shout', regex: '\\b\\d{3,}\\b' }
    expect(termMatches(term, normalize('ligou 190 de novo'))).toBe(true)
    expect(termMatches(term, normalize('ligou 19 de novo'))).toBe(false)
  })

  it('ignores an invalid custom regex instead of throwing', () => {
    const term = { id: 'broken', label: 'Broken', regex: '(' }
    expect(() => termMatches(term, normalize('qualquer coisa'))).not.toThrow()
    expect(termMatches(term, normalize('qualquer coisa'))).toBe(false)
  })
})

describe('matchTerms', () => {
  it('returns only the ids of terms present in the text', () => {
    const terms = [
      { id: 'racismo', label: 'Racismo' },
      { id: 'democracia', label: 'Democracia', stems: ['democr'] },
    ]
    expect(matchTerms('Isso é racismo, não democracia.', terms)).toEqual(['racismo', 'democracia'])
  })

  it('returns an empty array when nothing matches', () => {
    const terms = [{ id: 'racismo', label: 'Racismo' }]
    expect(matchTerms('Um dia ensolarado e tranquilo.', terms)).toEqual([])
  })
})

describe('terms.json (shipped list)', () => {
  const byId = Object.fromEntries(termsData.map((term) => [term.id, term]))

  it('has unique ids', () => {
    const ids = termsData.map((term) => term.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  const cases = [
    ['misoginia', 'Isso é pura misoginia da sua parte.'],
    ['misoginia', 'Ele é muito misógino com as colegas.'],
    ['machismo', 'Esse comentário é machista.'],
    ['democracia', 'Ele não é democrata coisa nenhuma.'],
    ['extrema-direita', 'Esse discurso é ultradireita.'],
    ['fascismo', 'Isso é fascismo puro.'],
    ['fascismo', 'Que comentário fascista.'],
    ['fascismo', 'Imagina quando começarmos a falar da veia criptofascista que sempre esteve ali.'],
    ['nazismo', 'Ele chamou todo mundo de nazi.'],
    ['nazismo', 'Para de comparar tudo com nazismo.'],
    ['milicia', 'As milícias dominam a região.'],
    ['milicia', 'Ele é apoiador de miliciano.'],
    ['homofobia', 'Comentário homofóbico, hein.'],
    ['transfobia', 'Discurso transfóbico de novo.'],
    ['patriarcado', 'Sociedade patriarcal, sempre.'],
    ['trama-golpista', 'Chamaram ele de golpista de novo.'],
    ['cultura-da-favela', 'Isso é cultura de favela, dizem.'],
    ['luta-de-classes', 'Isso é luta de classe, sempre foi.'],
    ['soberania', 'Discurso soberanista.'],
    ['racismo', 'Comentário racista, de novo.'],
    ['pobre-de-direita', 'Ele é um pobre de direita, nunca vai entender.'],
    ['pobre-de-direita', 'Esses pobres de direita de novo.'],
    ['feminismo', 'Chega de feminismo.'],
    ['feminismo', 'Ela é muito feminista.'],
    ['constituicao', 'Isso fere a Constituição.'],
    ['constituicao', 'Discurso inconstitucional, claramente.'],
    ['constituicao', 'Querem uma nova Assembleia Constituinte.'],
    ['ditadura', 'Isso lembra uma ditadura.'],
    ['ditadura', 'Ele defende o ditador.'],
    ['ditadura', 'Discurso ditatorial, sempre.'],
    ['patriotismo', 'Isso é só patriotismo.'],
    ['patriotismo', 'Somos todos patriotas aqui.'],
  ]

  it.each(cases)('%s matches %j', (expectedId, text) => {
    expect(byId[expectedId]).toBeDefined()
    expect(matchTerms(text, termsData)).toContain(expectedId)
  })

  it('does not match on unrelated text', () => {
    expect(matchTerms('Hoje o dia está bonito e o café estava ótimo.', termsData)).toEqual([])
  })
})
