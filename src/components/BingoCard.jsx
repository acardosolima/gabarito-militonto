import { forwardRef } from 'react'

const BingoCard = forwardRef(function BingoCard(
  { title, terms, checkedIds, onToggle, postRef, date, size, interactive },
  ref,
) {
  const total = terms.length
  const matched = checkedIds.length

  return (
    <div
      ref={ref}
      className="bingo-card"
      style={{ width: size.width, height: size.height }}
    >
      <header className="bingo-card__header">
        <h2>{title}</h2>
        <span className="bingo-card__counter">
          {matched}/{total} matched
        </span>
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
        <span>{date}</span>
        {postRef ? <span className="bingo-card__ref">{postRef}</span> : null}
      </footer>
    </div>
  )
})

export default BingoCard
