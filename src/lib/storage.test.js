import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadChecked,
  loadHistory,
  loadTheme,
  saveChecked,
  saveTheme,
  upsertSession,
} from './storage.js'

beforeEach(() => {
  localStorage.clear()
})

describe('checked ids', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadChecked()).toEqual([])
  })

  it('round-trips through localStorage', () => {
    saveChecked(['a', 'b'])
    expect(loadChecked()).toEqual(['a', 'b'])
  })

  it('falls back to an empty array on corrupted data', () => {
    localStorage.setItem('gabarito:checked', '{not json')
    expect(loadChecked()).toEqual([])
  })
})

describe('history', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadHistory()).toEqual([])
  })

  it('upsertSession appends a new session without a matching postRef', () => {
    const first = upsertSession({ id: '1', postRef: '', matchedTermIds: ['racismo'] })
    expect(first).toHaveLength(1)

    const second = upsertSession({ id: '2', postRef: '', matchedTermIds: ['fascista'] })
    expect(second).toHaveLength(2)
    expect(loadHistory()).toEqual(second)
  })

  it('upsertSession updates the existing session when the postRef repeats, instead of duplicating it', () => {
    upsertSession({
      id: '1',
      postRef: 'https://x.com/a/status/1',
      matchedTermIds: ['racismo'],
    })
    const updated = upsertSession({
      id: '2',
      postRef: 'https://x.com/a/status/1',
      matchedTermIds: ['racismo', 'fascista'],
    })

    expect(updated).toHaveLength(1)
    expect(updated[0].id).toBe('1') // keeps the original row's identity
    expect(updated[0].matchedTermIds).toEqual(['racismo', 'fascista'])
  })

  it('upsertSession treats different postRefs as different sessions', () => {
    upsertSession({ id: '1', postRef: 'https://x.com/a/status/1', matchedTermIds: ['racismo'] })
    const result = upsertSession({
      id: '2',
      postRef: 'https://x.com/a/status/2',
      matchedTermIds: ['fascista'],
    })
    expect(result).toHaveLength(2)
  })

  it('falls back to an empty array on corrupted data', () => {
    localStorage.setItem('gabarito:history', '{not json')
    expect(loadHistory()).toEqual([])
  })
})

describe('theme', () => {
  it('defaults to system when nothing is stored', () => {
    expect(loadTheme()).toBe('system')
  })

  it('round-trips a valid theme', () => {
    saveTheme('dark')
    expect(loadTheme()).toBe('dark')
  })

  it('falls back to system for an unrecognized stored value', () => {
    localStorage.setItem('gabarito:theme', 'not-a-theme')
    expect(loadTheme()).toBe('system')
  })
})
