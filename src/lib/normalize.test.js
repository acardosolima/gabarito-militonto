import { describe, expect, it } from 'vitest'
import { normalize } from './normalize.js'

describe('normalize', () => {
  it('lowercases', () => {
    expect(normalize('MISOGINIA')).toBe('misoginia')
  })

  it('strips accents', () => {
    expect(normalize('misógino')).toBe('misogino')
    expect(normalize('é à ç õ ã')).toBe('e a c o a')
  })

  it('replaces punctuation with spaces', () => {
    expect(normalize('golpe-de-estado!')).toBe('golpe de estado')
    expect(normalize('"citation needed"')).toBe('citation needed')
  })

  it('collapses repeated whitespace and trims', () => {
    expect(normalize('  isso   é   demais  ')).toBe('isso e demais')
  })

  it('keeps numbers', () => {
    expect(normalize('artigo 5 da constituicao')).toBe('artigo 5 da constituicao')
  })

  it('returns an empty string for only-punctuation input', () => {
    expect(normalize('!!!')).toBe('')
  })
})
