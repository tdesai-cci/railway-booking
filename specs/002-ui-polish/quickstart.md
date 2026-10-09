# Quickstart: 002-ui-polish Validation

Manual + browser walkthrough proving the polish end-to-end. Prereqs: Node 20+,
repo root.

## Setup

```powershell
npm install
npm run dev            # http://localhost:5173
```

Gates (before any hand-off):

```powershell
npm run build          # must pass
npm run check          # must pass, incl. new dup-hex / focus / state assertions
```

## Scenarios → expected outcomes

| # | Scenario (spec ref) | Expected |
|---|---|---|
| 1 | Tab through header → search form → footer on `/` and `/check-pnr` (US1/FR-001, FR-004) | Every control shows the shared focus ring — on navy hero, white sections and accent buttons alike; skip link works |
| 2 | Hover → press each button variant (`.btn-primary/accent/ghost/white/onhero`), `.tab`, `.swap`, stepper ±, `.ctl`, burger (US1/FR-001, FR-003) | Distinct hover and pressed look per control; same size class = same height/radius/padding/label on every page (SC-007) |
| 3 | Submit a search, then set both stations equal and submit again (US1/FR-002) | Submit swaps to busy label **without resizing or shifting neighbors** (SC-006); stepper ± disable at bounds |
| 4 | Every route (home, 8 shell pages, `/nope`) at 320 / 768 / 1024 / 1440 px (US3/FR-008) | Zero horizontal scrolling; nothing clipped or overlapping (SC-002) |
| 5 | 200% browser zoom on `/` and `/help` (US3) | Content reflows; nothing lost or unreachable |
| 6 | `npm run build` then `npm run preview` → landing (US3/FR-009) | All four route-card photos render (previously 404 in prod); hero/stat photos intact (SC-004) |
| 7 | DevTools → emulate `prefers-reduced-motion` → hover/press/submit (US1/FR-010) | All state changes still perceivable via color/opacity; motion reduced (constitution III) |
| 8 | Walk spacing: landing sections + heading outline h1→h2→h3 (US2/FR-006, FR-007) | Section gaps and type sizes all come from tokens — no one-off values (dup-hex check green) |
| 9 | Home + footer after all changes (constitution: attribution, brand) | 7 Wikimedia credit links render; wordmark/train mark/palette relationship unchanged |
| 10 | `npm run build` + `npm run check` final gate | Both pass; all `001-shell` assertions still green |

## Reading

- Control contract: [contracts/control-states.md](contracts/control-states.md)
- Token catalog & invariants: [data-model.md](data-model.md)
- Decisions: [research.md](research.md)
