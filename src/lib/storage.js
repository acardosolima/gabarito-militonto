const CHECKED_KEY = 'gabarito:checked'
const HISTORY_KEY = 'gabarito:history'

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

export function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // storage unavailable — history just won't persist
  }
}

export function appendSession(session) {
  const history = loadHistory()
  history.push(session)
  saveHistory(history)
  return history
}

export function clearHistory() {
  saveHistory([])
}
