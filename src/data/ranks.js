// Mirrors League of Legends' ranked ladder (pt-BR client naming), scaled to
// this app's match percentage instead of LP: Ferro, Bronze, Prata, Ouro,
// Platina, Esmeralda, Diamante, Mestre, Grão-Mestre, Desafiante.
// Ordered ascending by the minimum match percentage (0-1) required for the tier.
export const RANKS = [
  { min: 0, label: 'Não Classificado', color: '#8a8a8a' },
  { min: 0.01, label: 'Ferro', color: '#5c5c5c' },
  { min: 0.12, label: 'Bronze', color: '#a9744f' },
  { min: 0.23, label: 'Prata', color: '#9fa8b3' },
  { min: 0.34, label: 'Ouro', color: '#e3b23c' },
  { min: 0.45, label: 'Platina', color: '#4fd1c5' },
  { min: 0.56, label: 'Esmeralda', color: '#2ecc71' },
  { min: 0.67, label: 'Diamante', color: '#4fa3f7' },
  { min: 0.78, label: 'Mestre', color: '#a855f7' },
  { min: 0.89, label: 'Grão-Mestre', color: '#e63946' },
  { min: 1, label: 'Desafiante', color: '#f7d774' },
]

export function getRank(matched, total) {
  const pct = total > 0 ? matched / total : 0
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (pct >= RANKS[i].min) return RANKS[i]
  }
  return RANKS[0]
}
