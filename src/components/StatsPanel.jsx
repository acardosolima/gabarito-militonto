import { useMemo } from 'react'

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

export default function StatsPanel({ terms, history }) {
  const frequency = useMemo(() => buildFrequency(history, terms), [history, terms])
  const maxCount = Math.max(1, ...frequency.map((f) => f.count))

  return (
    <section className="stats-panel">
      <div className="stats-panel__toolbar">
        <span>{history.length} sessões salvas</span>
      </div>

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
