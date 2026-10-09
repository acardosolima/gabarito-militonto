# Gabarito Militonto

Buzzword-bingo card for Brazilian political/social online discourse. Paste a
post's text, it auto-detects known terms, check off the rest by hand, export
the card as a PNG sized for sharing.

Static React + Vite site, no backend, no login. Term matching and a small
local session history run entirely client-side via `localStorage`. Uses
[Vercel Analytics](https://vercel.com/docs/analytics) for anonymous,
cookieless page-view counts — no personal data collected.

## Requirements

- Node.js 20+

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite (Vitest)
npm run lint     # lint (oxlint)
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  components/   React components (BingoCard, StatsPanel, ErrorBoundary)
  data/         terms.json (the term list), ranks.js, termsVersion.js
  lib/          normalize/match (term-detection engine), storage, PNG export
```

### Editing the term list

Terms live in `src/data/terms.json`. Each entry:

```json
{ "id": "racismo", "label": "Racismo", "aliases": [], "stems": ["racis"] }
```

- `label` — what's shown on the card; also matched as-is.
- `aliases` — exact alternate words/phrases that don't share a root with the
  label (synonyms, multi-word variants).
- `stems` — a word root that matches anywhere inside a word (covers
  inflections and prefixed compounds, e.g. `"fascis"` matches "fascismo",
  "fascista", "criptofascista"). Prefer a longer, more specific stem over a
  short one if a shorter root risks colliding with unrelated words.

Bump `TERMS_VERSION` in `src/data/termsVersion.js` when the list changes
meaningfully — it's shown on the card and stored on every saved session, so
past exports stay traceable to the list that produced them.

## Deployment

Static build (`npm run build` → `dist/`), deployable to any static host.
Currently targeting Vercel. No environment variables or backend required.
