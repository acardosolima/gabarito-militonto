import { describe, expect, it } from 'vitest'
import { getRank } from './ranks.js'

describe('getRank', () => {
  it('returns Não Classificado for zero matches', () => {
    expect(getRank(0, 15).label).toBe('Não Classificado')
  })

  it('returns Desafiante only for a perfect match', () => {
    expect(getRank(15, 15).label).toBe('Desafiante')
    expect(getRank(14, 15).label).not.toBe('Desafiante')
  })

  it('scales by percentage, not raw count', () => {
    expect(getRank(1, 10).label).toBe(getRank(2, 20).label)
  })

  it('moves up through the ladder as the percentage increases', () => {
    expect(getRank(1, 20).label).toBe('Ferro') // 5%
    expect(getRank(3, 20).label).toBe('Bronze') // 15%
    expect(getRank(5, 20).label).toBe('Prata') // 25%
    expect(getRank(7, 20).label).toBe('Ouro') // 35%
    expect(getRank(9, 20).label).toBe('Platina') // 45%
    expect(getRank(12, 20).label).toBe('Esmeralda') // 60%
    expect(getRank(14, 20).label).toBe('Diamante') // 70%
    expect(getRank(16, 20).label).toBe('Mestre') // 80%
    expect(getRank(18, 20).label).toBe('Grão-Mestre') // 90%
  })

  it('handles a zero-term list without dividing by zero', () => {
    expect(() => getRank(0, 0)).not.toThrow()
    expect(getRank(0, 0).label).toBe('Não Classificado')
  })
})
