---
_harness_template: "Plans.md.template"
_harness_version: "4.3.3"
---

# Plans.md - Task Tracking

> **Project**: gabarito-militonto
> **Last updated**: 2026-10-05
> **Updated by**: Claude Code

---

## In Progress

<!-- Add tasks with cc:wip here. -->

(none)

---

## Not Started

<!-- Add tasks with cc:todo or pm:requested here. -->

- [ ] Backend/DB-backed stats persistence (append-only, no user delete) `cc:todo`
- [ ] Phase 4 (optional): browser extension for in-page detection on x.com `cc:todo`
- [ ] Phase 4 (optional): PWA packaging for offline/mobile use `cc:todo`
- [ ] Phase 4 (optional): multiple term lists/themes `cc:todo`
- [ ] Phase 4 (optional): shareable URL encoding checked state `cc:todo`
- [ ] Phase 4 (optional): auto-fetch X post content from a pasted link — requires a backend (CORS blocks client-side fetch of x.com; official API needs a server-held secret). Evaluate official X API (paid, stable) vs. server-side scraping (free-ish, fragile, ToS risk) before committing `cc:todo`
- [ ] Component/interaction tests (e.g. `toggleTerm`/`excludedIds`, theme toggle) via `@testing-library/react` — current suite covers `src/lib/*`, `src/data/*`, and `ErrorBoundary`, but not `App`/`BingoCard`'s own interaction logic. Decide on a CSP (best set at the hosting layer, not in-app) `cc:todo`

---

## Completed

<!-- Add tasks with cc:done or pm:approved here. -->

- [x] Introduce the 2-Agent / 2-Claude workflow `pm:approved` (2026-10-05)
- [x] Harness init: CLAUDE.md / AGENTS.md / Plans.md / harness.toml / hooks sync `pm:approved` (2026-10-05)
- [x] Scaffold Vite + React static site (no backend) `cc:done` (2026-10-05)
- [x] Phase 1: manual checklist grid with match counter `cc:done` (2026-10-05)
- [x] Phase 1: PNG export (1080x1080 / 1200x630) via html-to-image, with counter/date/post link `cc:done` (2026-10-05)
- [x] Phase 2: paste-text auto-detection (normalize + alias/regex matching), manual override `cc:done` (2026-10-05)
- [x] Phase 3: local-only session history + frequency ranking, JSON export/import, via localStorage `cc:done` (2026-10-05)
- [x] Fix: manual uncheck of an auto-matched term now sticks (tracked via excludedIds) instead of being silently re-checked by further paste edits `cc:done` (2026-10-05)
- [x] Fix: Stats import now validates each session has `matchedTermIds`, drops invalid entries, and surfaces an error message instead of a silent no-op `cc:done` (2026-10-05)
- [x] Change: removed the separate "Save session to stats" button — a session is now saved automatically as part of Export PNG `cc:done` (2026-10-05)
- [x] Add `TERMS_VERSION` (`src/data/termsVersion.js`), rendered on the card/export and stored per session in history, so future term-list edits are traceable to the sessions they produced `cc:done` (2026-10-07)
- [x] Remove "Clear history" from Stats panel — local history is no longer user-deletable, ahead of planned DB-backed persistence `cc:done` (2026-10-07)
- [x] Remove Export/Import JSON from Stats panel entirely — local history is throwaway cache, not a source of truth, so round-tripping it through files doesn't make sense once the DB owns stats `cc:done` (2026-10-07)
- [x] Fix card readability: cell/header/footer font-size was keyed to viewport width (`vw`), not the card's own fixed export size, so it shrank on normal browser windows regardless of the 1080x1080/1200x630 canvas. Switched to CSS container queries (`cqw`) scoped to `.bingo-card`, enlarged type scale, and gave the version badge and post-link footer chip solid-background treatment for contrast. Verified via headless-browser screenshot of both export sizes `cc:done` (2026-10-07)
- [x] Add stem-based matching (`term.stems`, `src/lib/match.js`) so one term entry matches inflected word forms (e.g. `misogin` → "misoginia", "misógino", "misógina") without needing every variant listed as a literal alias `cc:done` (2026-10-07)
- [x] Replace placeholder term list with the real v0.0.1 set (15 PT-BR political/social buzzwords: misoginia, machismo, democracia, extrema direita, fascista, nazista, miliciano, homofobia, transfobia, patriarcado, trama golpista, cultura da favela, luta de classes, soberania, racismo), using `stems` for single-word root variants and `aliases` for unrelated phrasing/multi-word variants `cc:done` (2026-10-07)
- [x] Add light/dark theme support: CSS custom properties in `src/index.css` for all colors (light values at `:root`, dark values under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`), a 3-state toggle (System/Light/Dark) in the nav persisted via `localStorage` (`src/lib/storage.js` `loadTheme`/`saveTheme`), applied by setting `document.documentElement.dataset.theme`. Verified both OS-preference defaults and manual overrides via headless-browser screenshots `cc:done` (2026-10-07)
- [x] Add a unit test suite (Vitest + jsdom): `src/lib/normalize.test.js`, `src/lib/match.test.js` (covers aliases/stems/regex on synthetic terms, plus every shipped `terms.json` entry), `src/lib/storage.test.js` (localStorage round-trip + corrupted-data fallback for checked/history/theme). `npm test` wired up; 43 tests passing `cc:done` (2026-10-07)
- [x] Add CI (`.github/workflows/ci.yml`): runs `npm ci`, lint, test, build on push to `master` and on PRs `cc:done` (2026-10-07)
- [x] Fix: stem matching only matched the root at the *start* of a word, missing prefixed compounds like "criptofascista" (cripto + fascista). Broadened `stemRegExp` to match the root anywhere in the word, with regression tests for a real missed post and for a couple of unrelated "-cracia" words to confirm no new false positives `cc:done` (2026-10-07)
- [x] Fix: post-link footer truncated long X URLs with an ellipsis. Footer is now a stacked (date above, link below) full-width layout with `overflow-wrap`/`word-break` so the whole link always renders, wrapping onto multiple lines if needed instead of cutting off `cc:done` (2026-10-07)
- [x] Add a match-percentage rank badge (`src/data/ranks.js`), shown next to the matched-count counter on the card/export, plus an inline-SVG shield/star badge icon colored per tier (`BingoCard.jsx` `RankBadge`) `cc:done` (2026-10-07)
- [x] Rework the rank ladder to mirror League of Legends' actual ranked tiers and pt-BR client naming (verified via web search, not assumed): Não Classificado, Ferro, Bronze, Prata, Ouro, Platina, Esmeralda, Diamante, Mestre, Grão-Mestre, Desafiante — Desafiante reserved for a perfect card `cc:done` (2026-10-07)
- [x] Localize all app UI text to pt-BR (tabs, theme toggle, form labels/placeholders, export controls, card title "Bingo de Jargões", stats panel, `<html lang>`) — term content was already Portuguese, English chrome around it no longer matches the target audience `cc:done` (2026-10-07)
- [x] Fix: an out-of-session edit to `src/data/ranks.js` moved `Não Classificado` to `min: -1` and `Ferro` to `min: 0`, which made `Ferro` swallow the zero-match case (`Não Classificado` became unreachable) — caught by the existing test suite (2 failures). Restored `Não Classificado: min 0` / `Ferro: min 0.01` `cc:done` (2026-10-07)
- [x] Move "Nova cartela" out of the export controls row into its own section `cc:done` (2026-10-07), then re-positioned again `cc:done` (2026-10-07): a form-column divider was still the wrong place for a card-reset action — moved it into a small toolbar directly above the card preview itself (`app__card-wrapper`/`app__card-toolbar`), width-matched to the card's export size, so it's spatially tied to what it affects instead of buried at the bottom of an unrelated form
- [x] Fix: every "Exportar PNG" click unconditionally appended a new stats session, so re-exporting the same post counted it multiple times in the frequency ranking. Replaced `appendSession` with `upsertSession` (`src/lib/storage.js`), keyed by `postRef`: re-exporting a post with the same link updates that session in place instead of duplicating it. A post exported with no link still always appends (no stable identity to dedupe on without persisting the raw post text, which isn't stored) `cc:done` (2026-10-07)
- [x] Fix mobile/narrow-viewport overflow, attempt 1 (superseded below): scaled the single shared card node down via a JS-computed CSS `transform`. Worked but felt wrong in practice — on resize the preview looked like a shrunk miniature of the desktop layout rather than a real mobile-style reflow `cc:done` (2026-10-07)
- [x] Rework responsiveness properly: split the on-screen card from the export source. The visible `BingoCard` (`App.jsx`, no `size` prop) is now a normal responsive element — no fixed width, no transform — with the term grid reflowing via container-query breakpoints on `.bingo-card`'s own width (5 cols → 3 cols at ≤560px → 2 cols at ≤400px, "like every mobile app"). A second `BingoCard` instance, fixed at the chosen export size, renders off-screen (`position:fixed; left:-10000px`, `.app__export-stage`) purely as `exportNodeAsPng`'s capture target, so PNG export always stays full-resolution regardless of the live preview. Also widened `.app__card-wrapper` (`flex:1 1 420px; max-width:800px`) and capped `.app__controls` (`flex:0 1 360px`) so the card gets the lion's share of desktop width instead of an even 50/50 split `cc:done` (2026-10-07)
- [x] Fix: `.bingo-card__grid`'s `gap: 2.5%` was a row-gap percentage resolving against the card's own height — spec-ambiguous once the card has no fixed height, and empirically caused the last grid row to render outside the grid's own box (overlapping the footer) on narrow/auto-height cards. Changed to `gap: 2.5cqw` (resolves against the card's always-definite inline size) `cc:done` (2026-10-07)
- [x] Fix: the rank badge/label could overflow the card's right edge on narrow widths when both the title wrapped and the rank label was long (e.g. "DESAFIANTE"), due to default flex `min-width:auto` blocking shrink/wrap. Added `flex-wrap` to the header and `min-width:0` to its flex children. Verified full responsive sweep (1400/600/375/320px, plus a shrink-then-maximize cycle) via headless-browser screenshots: no horizontal overflow at any size, export clone's `offsetWidth` stays pinned at 1080/1200 throughout `cc:done` (2026-10-07)
- [x] Fix: grid cells had inconsistent heights (rows with a 2-line label were taller than rows of 1-line labels) — look very uneven once the card's own fixed-aspect canvas was removed. Gave `.bingo-card__cell` `aspect-ratio: 1` so every cell is a uniform square regardless of label length, like a real bingo card. Verified no console/page errors across the full flow (check cells, paste-detect, export, stats, theme toggle, reset) `cc:done` (2026-10-07)
- [x] Revert the page layout to always-stacked (form above, card below), full width up to `max-width:800px`, at every viewport size. The previous side-by-side-on-wide-screens behavior (inherited from the original scaffold) was never actually wanted — removed `.app__card-view`'s flex-row/wrap in favor of `flex-direction: column` `cc:done` (2026-10-07)
- [x] Add `feminismo` (stem `feminis`) and `pobre-de-direita` (alias-only: "pobre de direita"/"pobres de direita" — "pobre" and "direita" are too generic to stem individually without false-positiving on unrelated text) to the v0.0.1 term list, now 17 terms `cc:done` (2026-10-07)
- [x] Renamed `fascista` → `fascismo` (id + label) to match the noun-form pattern every other term already used (misoginia, machismo, democracia, homofobia, ... racismo was already "Racismo", not "Racista" as flagged — only fascista was the actual outlier). Stem unchanged (`fascis` already covers both forms). Added `constituicao` (stem `constitu`, covers constituição/constitucional/constituinte). Now 18 terms `cc:done` (2026-10-08)
- [x] Same adjective→noun fix applied to the two terms missed the first pass: `nazista` → `nazismo`, `miliciano` → `milicia` ("Milícia"). Stems unchanged in both cases (already covered the adjective/person form); only id/label changed `cc:done` (2026-10-08)
- [x] Add `ditadura` (stems: `ditadura`/`ditador`/`ditatorial` — deliberately three full-word stems, not one short shared root like `ditad`, because `ditad` is a substring of "creditado"/"creditar" and would false-positive on unrelated finance-y text; covered by a regression test). Now 19 terms `cc:done` (2026-10-08)
- [x] Hide the Stats tab from the UI ahead of public deploy (`STATS_ENABLED = false` in `App.jsx`) — stats are still local-only/no backend, not ready to show publicly. Data collection (`upsertSession` on export) keeps running silently so history isn't lost; flipping the flag brings the tab straight back. Also softened the post-export notice to "Exportado." instead of referencing the now-hidden stats page `cc:done` (2026-10-09)
- [x] Pre-launch hardening: added `README.md` (setup/scripts/project structure/term-list editing guide); `<meta name="description">` + Open Graph + Twitter Card tags in `index.html` (no `og:image`/`twitter:image` — no static preview image asset exists yet to point at, left out rather than reference a broken one); `ErrorBoundary` component wrapping `<App>` in `main.jsx` so a thrown render error shows a fallback message instead of a blank page, with a real-React (`createRoot`+`act`, no new testing-library dependency) regression test `cc:done` (2026-10-09)
- [x] Connected GitHub (`git@github.com:acardosolima/gabarito-militonto.git` as `origin`), pushed the full session's work as commit `c957238` to `master`. CI now actually runs on real pushes/PRs `cc:done` (2026-10-09)
- [x] Add `patriotismo` (stem `patriot`, covers patriota/patriotas/patriotismo/patriótico) — same adjective→noun pattern as the other renames; the literal word the user asked for ("patriota") still matches via the stem. Now 20 terms `cc:done` (2026-10-09)
- [x] Add release-please (`release-please-config.json`, `.release-please-manifest.json`, `.github/workflows/release-please.yml`, release-type `node`): parses Conventional Commit messages on push to `master`, auto-bumps `package.json`'s `version`, tags, and cuts a GitHub Release. App reads `version` from `package.json` at build time (`import { version as APP_VERSION } from '../package.json'`) and shows it as a clickable link to that release's GitHub page, in the nav bar — separate from the on-card `TERMS_VERSION` badge, which tracks term-list content, not app releases. First deploy shows `v0.0.0` and the release link 404s until the first release-please PR merges and cuts an actual `v0.0.0`/next tag — self-resolves after that `cc:done` (2026-10-09)
- [x] Investigated reported "extrema-direita" detection miss with the user's exact post text — reproduced locally, `matchTerms` correctly returns `extrema-direita` (plus milicia/trama-golpista/patriotismo) for that text. Not a code defect; most likely the live site was tested before the first push/deploy landed, or a stale browser cache. No code change made `cc:done` (2026-10-09)
- [x] Add Vercel Analytics (`@vercel/analytics`): `<Analytics />` rendered in `main.jsx`, outside `<ErrorBoundary>` so it keeps working even if `<App>` crashes. Updated `README.md`'s "no tracking" claim, which this makes inaccurate, to describe what's actually collected (anonymous, cookieless page views) `cc:done` (2026-10-09)

### Decisions locked in for this build

- **Stats scope**: local-only (localStorage), no backend. No global/cross-user stats.
- **Detection input**: paste-text only. No browser extension in this pass (Phase 4 backlog item above).
- **Term list**: fixed JSON file (`src/data/terms.json`), seeded with a generic placeholder set of online-debate buzzwords pending the real list.
- **Storage engine**: plain `localStorage` instead of IndexedDB — dataset is small (checked-state + a session list), so the extra API surface wasn't worth it.
- **Stats deletion**: no user-facing delete, and no Export/Import JSON either. Stats are meant to be an append-only record read from a backend DB; the local-only build matches that now by not exposing any way to delete, rewrite, or replace saved sessions.
- **Term list versioning**: `TERMS_VERSION` in `src/data/termsVersion.js`, bumped by hand when `terms.json` changes. Shown on the card/export and stored on each saved session (`termsVersion`), so a session can always be traced back to the term set that produced it once the term list starts evolving.
- **Theme default**: follows OS `prefers-color-scheme` until the user explicitly toggles; the manual choice then overrides and persists. No separate "auto" indicator needed beyond the toggle label itself.
- **Morphological matching**: a term can now carry a `stems` array (`src/lib/match.js`) alongside `label`/`aliases`/`regex`. Each stem matches any word *containing* that root anywhere (start, middle, or end) after accent-stripping — so one entry (e.g. `"stems": ["misogin"]`) covers "misoginia", "misógino", "misógina", and also prefixed compounds like `"fascis"` → "criptofascista", "neofascista", "antifascista", without listing every inflected/compound form. Use `aliases` for distinct whole words/phrases, `stems` for shared word roots.

---

## Archive

<!-- Move older completed tasks here. -->

---

## Status Marker Legend

These markers are protocol values used by Harness tooling. Keep them unchanged
unless the project has tested parser aliases.

| Marker | Meaning |
|--------|---------|
| `pm:requested` | PM requested work |
| `cc:todo` | Not started by Claude Code |
| `cc:wip` | Claude Code is working |
| `cc:done` | Claude Code completed the task and is awaiting confirmation |
| `pm:approved` | PM confirmed completion |
| `pm:依頼中` | Compatibility alias for `pm:requested` |
| `cc:TODO` | Compatibility alias for `cc:todo` |
| `cc:WIP` | Compatibility alias for `cc:wip` |
| `pm:確認済` | Compatibility alias for `pm:approved` |
| `cursor:依頼中` | Compatibility alias for `pm:requested` |
| `cursor:確認済` | Compatibility alias for `pm:approved` |
| `blocked` | Blocked; include the reason next to the task |

---

## Optional Extended Syntax

For larger plans, you may add task IDs, dependencies, and parallel markers.

### Task ID / Dependency / Parallel Marker

```markdown
- [ ] T001: Authentication `cc:todo`
- [ ] T002: User API `cc:todo` depends:T001
- [ ] T003: Product API `cc:todo` [P]
- [ ] T004: Order API `cc:todo` depends:T001,T003
```

| Syntax | Meaning | Example |
|--------|---------|---------|
| `T001:` | Optional task ID | Used for references and dependencies |
| `depends:ID` | Dependency task | `depends:T001,T002` |
| `[P]` | Parallelizable | Can run at the same time as other ready tasks |

**Note**: Extended syntax is optional. The plain checklist format still works.

---

## Last Update

- **Updated at**: 2026-10-05
- **Last session owner**: Claude Code
- **Branch**: master
