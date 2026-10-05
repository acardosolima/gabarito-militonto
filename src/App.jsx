import { useMemo, useRef, useState } from 'react'
import BingoCard from './components/BingoCard.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import termsData from './data/terms.json'
import { matchTerms } from './lib/match.js'
import { exportNodeAsPng } from './lib/exportImage.js'
import {
  appendSession,
  clearHistory,
  loadChecked,
  loadHistory,
  saveChecked,
  saveHistory,
} from './lib/storage.js'
import './App.css'

const EXPORT_SIZES = {
  square: { label: 'Square (1080x1080)', width: 1080, height: 1080 },
  landscape: { label: 'Landscape (1200x630)', width: 1200, height: 630 },
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [tab, setTab] = useState('card')
  const [checkedIds, setCheckedIds] = useState(() => loadChecked())
  const [excludedIds, setExcludedIds] = useState([])
  const [history, setHistory] = useState(() => loadHistory())
  const [postText, setPostText] = useState('')
  const [postRef, setPostRef] = useState('')
  const [exportSizeKey, setExportSizeKey] = useState('square')
  const [savedNotice, setSavedNotice] = useState(false)

  const cardRef = useRef(null)
  const exportSize = EXPORT_SIZES[exportSizeKey]

  function updateChecked(next) {
    setCheckedIds(next)
    saveChecked(next)
  }

  function toggleTerm(id) {
    if (checkedIds.includes(id)) {
      updateChecked(checkedIds.filter((existing) => existing !== id))
      setExcludedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    } else {
      updateChecked([...checkedIds, id])
      setExcludedIds((prev) => prev.filter((existing) => existing !== id))
    }
  }

  function handlePasteChange(event) {
    const text = event.target.value
    setPostText(text)
    const matched = matchTerms(text, termsData).filter((id) => !excludedIds.includes(id))
    updateChecked([...new Set([...checkedIds, ...matched])])
  }

  function handleReset() {
    updateChecked([])
    setExcludedIds([])
    setPostText('')
    setPostRef('')
    setSavedNotice(false)
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  function handleImportHistory(imported) {
    const valid = imported.filter(
      (entry) => entry && typeof entry === 'object' && Array.isArray(entry.matchedTermIds),
    )
    saveHistory(valid)
    setHistory(valid)
    return valid.length
  }

  async function handleExport() {
    if (!cardRef.current) return
    await exportNodeAsPng(cardRef.current, `bingo-${today()}.png`)
    const session = {
      id: crypto.randomUUID(),
      date: today(),
      postRef,
      matchedTermIds: checkedIds,
    }
    const next = appendSession(session)
    setHistory(next)
    setSavedNotice(true)
  }

  const matchedCount = useMemo(() => checkedIds.length, [checkedIds])

  return (
    <div className="app">
      <nav className="app__tabs">
        <button
          type="button"
          className={tab === 'card' ? 'is-active' : ''}
          onClick={() => setTab('card')}
        >
          Card
        </button>
        <button
          type="button"
          className={tab === 'stats' ? 'is-active' : ''}
          onClick={() => setTab('stats')}
        >
          Stats
        </button>
      </nav>

      {tab === 'card' ? (
        <div className="app__card-view">
          <section className="app__controls">
            <label className="app__field">
              Paste post text to auto-detect terms
              <textarea
                value={postText}
                onChange={handlePasteChange}
                placeholder="Paste the post text here..."
                rows={5}
              />
            </label>

            <label className="app__field">
              Post link (optional, shown on export)
              <input
                type="text"
                value={postRef}
                onChange={(event) => setPostRef(event.target.value)}
                placeholder="https://x.com/..."
              />
            </label>

            <div className="app__row">
              <label className="app__field app__field--inline">
                Export size
                <select
                  value={exportSizeKey}
                  onChange={(event) => setExportSizeKey(event.target.value)}
                >
                  {Object.entries(EXPORT_SIZES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={handleExport}>Export PNG</button>
              <button type="button" onClick={handleReset}>New card</button>
            </div>

            {savedNotice ? <p className="app__notice">Exported and saved to stats.</p> : null}
            <p className="app__hint">{matchedCount}/{termsData.length} matched</p>
          </section>

          <div className="app__card-wrapper">
            <BingoCard
              ref={cardRef}
              title="Buzzword Bingo"
              terms={termsData}
              checkedIds={checkedIds}
              onToggle={toggleTerm}
              postRef={postRef}
              date={today()}
              size={exportSize}
              interactive
            />
          </div>
        </div>
      ) : (
        <StatsPanel
          terms={termsData}
          history={history}
          onClear={handleClearHistory}
          onImport={handleImportHistory}
        />
      )}
    </div>
  )
}
