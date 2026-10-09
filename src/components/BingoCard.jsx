import { forwardRef } from 'react'
import { getRank } from '../data/ranks.js'

function RankBadge({ color }) {
  return (
    <svg className="bingo-card__rank-badge" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1l8 3v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V4z"
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.5"
      />
      <path
        d="M12 6.5l1.5 3 3.3.3-2.5 2.2.8 3.2-3.1-1.8-3.1 1.8.8-3.2-2.5-2.2 3.3-.3z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  )
}

const BingoCard = forwardRef(function BingoCard(
  { title, terms, termsVersion, checkedIds, onToggle, postRef, date, size, interactive },
  ref,
) {
  const total = terms.length
  const matched = checkedIds.length
  const rank = getRank(matched, total)

  return (
    <div
      ref={ref}
      className="bingo-card"
      style={size ? { width: size.width, height: size.height } : undefined}
    >
      <header className="bingo-card__header">
        <h2>
          {title}
          {termsVersion ? <span className="bingo-card__version">{termsVersion}</span> : null}
        </h2>
        <div className="bingo-card__counter">
          <span className="bingo-card__rank-row">
            <RankBadge color={rank.color} />
            <span className="bingo-card__rank" style={{ color: rank.color }}>{rank.label}</span>
          </span>
          <span className="bingo-card__count">{matched}/{total} marcados</span>
        </div>
      </header>

      <div className="bingo-card__grid">
        {terms.map((term) => {
          const checked = checkedIds.includes(term.id)
          return (
            <button
              key={term.id}
              type="button"
              className={checked ? 'bingo-card__cell is-checked' : 'bingo-card__cell'}
              onClick={interactive ? () => onToggle(term.id) : undefined}
              disabled={!interactive}
            >
              {term.label}
            </button>
          )
        })}
      </div>

      <footer className="bingo-card__footer">
        <span className="bingo-card__date">{date}</span>
        {postRef ? <span className="bingo-card__ref">{postRef}</span> : null}
      </footer>
    </div>
  )
})

export default BingoCard
