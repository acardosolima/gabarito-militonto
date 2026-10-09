const CHECKED_KEY = 'gabarito:checked'
const HISTORY_KEY = 'gabarito:history'
const THEME_KEY = 'gabarito:theme'
const THEMES = ['system', 'light', 'dark']

export function loadChecked() {
  try {
    const raw = localStorage.getItem(CHECKED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveChecked(checkedIds) {
  try {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedIds))
  } catch {
    // storage unavailable (private mode, quota) — state just won't persist
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // storage unavailable — history just won't persist
  }
}

// Keyed by postRef so re-exporting the same post (e.g. after toggling a few
// more cells) updates that session instead of counting it twice in stats.
// Without a postRef there's no reliable way to tell two exports are "the same
// post" (raw post text isn't persisted), so those always append.
export function upsertSession(session) {
  const history = loadHistory()
  const key = session.postRef?.trim()
  const index = key ? history.findIndex((entry) => entry.postRef?.trim() === key) : -1
  if (index >= 0) {
    history[index] = { ...session, id: history[index].id }
  } else {
    history.push(session)
  }
  saveHistory(history)
  return history
}

export function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    return THEMES.includes(raw) ? raw : 'system'
  } catch {
    return 'system'
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable — theme choice just won't persist
  }
}
