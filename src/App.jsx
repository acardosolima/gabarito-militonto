import { useEffect, useMemo, useRef, useState } from 'react'
import BingoCard from './components/BingoCard.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import termsData from './data/terms.json'
import { TERMS_VERSION } from './data/termsVersion.js'
import { matchTerms } from './lib/match.js'
import { exportNodeAsPng } from './lib/exportImage.js'
import {
  loadChecked,
  loadHistory,
  loadTheme,
  saveChecked,
  saveTheme,
  upsertSession,
} from './lib/storage.js'
import './App.css'

const EXPORT_SIZES = {
  square: { label: 'Quadrado (1080x1080)', width: 1080, height: 1080 },
  landscape: { label: 'Paisagem (1200x630)', width: 1200, height: 630 },
}

const NEXT_THEME = { system: 'light', light: 'dark', dark: 'system' }
const THEME_LABEL = { system: 'Tema: Sistema', light: 'Tema: Claro', dark: 'Tema: Escuro' }

// Stats are local-only for now (see Plans.md backlog: DB-backed persistence).
// Hidden from the UI until that's in place; flip this to bring the tab back.
const STATS_ENABLED = false

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
  const [theme, setTheme] = useState(() => loadTheme())

  const cardRef = useRef(null)
  const exportSize = EXPORT_SIZES[exportSizeKey]

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  function cycleTheme() {
    const next = NEXT_THEME[theme]
    setTheme(next)
    saveTheme(next)
  }

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

  async function handleExport() {
    if (!cardRef.current) return
    await exportNodeAsPng(cardRef.current, `bingo-${today()}.png`)
    const session = {
      id: crypto.randomUUID(),
      date: today(),
      postRef,
      matchedTermIds: checkedIds,
      termsVersion: TERMS_VERSION,
    }
    const next = upsertSession(session)
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
          Cartela
        </button>
        {STATS_ENABLED ? (
          <button
            type="button"
            className={tab === 'stats' ? 'is-active' : ''}
            onClick={() => setTab('stats')}
          >
            Estatísticas
          </button>
        ) : null}
        <span className="app__tabs-spacer" />
        <button type="button" className="app__theme-toggle" onClick={cycleTheme}>
          {THEME_LABEL[theme]}
        </button>
      </nav>

      {tab === 'card' || !STATS_ENABLED ? (
        <div className="app__card-view">
          <section className="app__controls">
            <label className="app__field">
              Cole o texto do post para detectar os termos automaticamente
              <textarea
                value={postText}
                onChange={handlePasteChange}
                placeholder="Cole o texto do post aqui..."
                rows={5}
              />
            </label>

            <label className="app__field">
              Link do post (opcional, exibido na exportação)
              <input
                type="text"
                value={postRef}
                onChange={(event) => setPostRef(event.target.value)}
                placeholder="https://x.com/..."
              />
            </label>

            <div className="app__row">
              <label className="app__field app__field--inline">
                Tamanho da exportação
                <select
                  value={exportSizeKey}
                  onChange={(event) => setExportSizeKey(event.target.value)}
                >
                  {Object.entries(EXPORT_SIZES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={handleExport}>Exportar PNG</button>
            </div>

            {savedNotice ? (
              <p className="app__notice">
                {STATS_ENABLED ? 'Exportado e salvo nas estatísticas.' : 'Exportado.'}
              </p>
            ) : null}
            <p className="app__hint">{matchedCount}/{termsData.length} marcados</p>
          </section>

          <div className="app__card-wrapper">
            <div className="app__card-toolbar">
              <button type="button" className="app__reset-button" onClick={handleReset}>
                Nova cartela
              </button>
            </div>
            <BingoCard
              title="Gabarito do Militonto"
              terms={termsData}
              termsVersion={TERMS_VERSION}
              checkedIds={checkedIds}
              onToggle={toggleTerm}
              postRef={postRef}
              date={today()}
              interactive
            />
          </div>

          {/* Fixed-size, off-screen clone used only as the PNG export source,
              so the visible card above can stay a normal responsive layout. */}
          <div className="app__export-stage" aria-hidden="true">
            <BingoCard
              ref={cardRef}
              title="Gabarito do Militonto"
              terms={termsData}
              termsVersion={TERMS_VERSION}
              checkedIds={checkedIds}
              postRef={postRef}
              date={today()}
              size={exportSize}
            />
          </div>
        </div>
      ) : (
        <StatsPanel terms={termsData} history={history} />
      )}
    </div>
  )
}
