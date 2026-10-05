import { useMemo, useRef, useState } from 'react'

function buildFrequency(history, terms) {
  const counts = new Map(terms.map((term) => [term.id, 0]))
  for (const session of history) {
    for (const id of session.matchedTermIds) {
      if (counts.has(id)) counts.set(id, counts.get(id) + 1)
    }
  }
  const labelById = new Map(terms.map((term) => [term.id, term.label]))
  return [...counts.entries()]
    .map(([id, count]) => ({ id, label: labelById.get(id), count }))
    .sort((a, b) => b.count - a.count)
}

export default function StatsPanel({ terms, history, onClear, onImport }) {
  const fileInputRef = useRef(null)
  const [importError, setImportError] = useState('')
  const frequency = useMemo(() => buildFrequency(history, terms), [history, terms])
  const maxCount = Math.max(1, ...frequency.map((f) => f.count))

  function handleExport() {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'gabarito-history.json'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) {
          setImportError('Import failed: file is not a session list.')
          return
        }
        const importedCount = onImport(parsed)
        setImportError(
          importedCount < parsed.length
            ? `Imported ${importedCount} of ${parsed.length} sessions; the rest had an invalid shape.`
            : '',
        )
      } catch {
        setImportError('Import failed: file is not valid JSON.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <section className="stats-panel">
      <div className="stats-panel__toolbar">
        <span>{history.length} sessions saved</span>
        <div className="stats-panel__actions">
          <button type="button" onClick={handleExport}>Export JSON</button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>Import JSON</button>
          <button type="button" onClick={onClear}>Clear history</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {importError ? <p className="stats-panel__error">{importError}</p> : null}

      <ol className="stats-panel__ranking">
        {frequency.map(({ id, label, count }) => (
          <li key={id}>
            <span className="stats-panel__label">{label}</span>
            <div className="stats-panel__bar-track">
              <div
                className="stats-panel__bar"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="stats-panel__count">{count}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
