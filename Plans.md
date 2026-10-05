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

- [ ] Replace placeholder term list in `src/data/terms.json` with real terms `cc:todo`
- [ ] Phase 4 (optional): browser extension for in-page detection on x.com `cc:todo`
- [ ] Phase 4 (optional): PWA packaging for offline/mobile use `cc:todo`
- [ ] Phase 4 (optional): multiple term lists/themes `cc:todo`
- [ ] Phase 4 (optional): shareable URL encoding checked state `cc:todo`

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

### Decisions locked in for this build

- **Stats scope**: local-only (localStorage), no backend. No global/cross-user stats.
- **Detection input**: paste-text only. No browser extension in this pass (Phase 4 backlog item above).
- **Term list**: fixed JSON file (`src/data/terms.json`), seeded with a generic placeholder set of online-debate buzzwords pending the real list.
- **Storage engine**: plain `localStorage` instead of IndexedDB — dataset is small (checked-state + a session list), so the extra API surface wasn't worth it.

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
- **Branch**: main
