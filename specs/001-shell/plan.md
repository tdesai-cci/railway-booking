# Implementation Plan: Routing Shell

**Branch**: `001-shell` | **Date**: 2026-10-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-shell/spec.md`

## Summary

Turn the single anchor-scrolled landing page into a routed SPA: every page in
`CAPABILITIES.md` gets a URL, header/footer/mobile nav link to real routes
driven by one route table, unknown URLs show a not-found page, and routes
whose modules have not shipped yet render labeled placeholders. One new
dependency: `react-router-dom`. No data, no backend.

## Technical Context

**Language/Version**: JavaScript ESM, React 19.1, Vite 7

**Primary Dependencies**: react-router-dom (new, approved in CAPABILITIES.md);
framer-motion 12 (existing, unchanged)

**Storage**: N/A — no data introduced; shell is navigation structure only

**Testing**: no test framework in repo (and none added for this). Gates are
`npm run build`, `npm run check` (existing self-check script, extended with
route-table ↔ nav consistency assertions), and the manual walk-through in
[quickstart.md](quickstart.md)

**Target Platform**: Modern browsers, static build output (`dist/`)

**Project Type**: Web SPA, frontend-only, mock data

**Performance Goals**: Route change renders instantly (no lazy-loading need at
this scale); existing motion keeps 60 fps

**Constraints**: WCAG 2.2 AA (constitution III) — focus management on route
change, existing aria attributes preserved, reduced-motion paths unchanged;
footer photo attribution must survive the split (constitution II/workflow)

**Scale/Scope**: ~10 routes, 1 new dependency, ~4 new/changed source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Verdict | Evidence |
|---|---|---|
| I. No Fee Surprises | PASS | Shell shows no figures; placeholder copy carries no prices |
| II. Brand Boundaries | PASS | Header/footer move verbatim; wordmark, TrainMark, palette untouched; Wikimedia credit line preserved in footer |
| III. Accessibility WCAG 2.2 AA | PASS | Focus moves to main on route change; skip link kept; mobile-menu `aria-expanded`/`aria-controls` kept; no new animations outside existing motion helpers' reduced-motion paths |
| IV. Two speeds | PASS | Shell is pacing-neutral; landing content unchanged |
| V. Honest motion, boring code | PASS | One route table array drives router + all navs; one shared Placeholder component; no router-building, no per-page stub files |
| Product constraints (voice, evidence, mock boundary) | PASS | Placeholder copy is plain and names what will live there; no invented figures; no backend calls |
| Development workflow | PASS | Spec approved 2026-10-08; `react-router-dom` is ask-first and was approved in CAPABILITIES.md; build + check gates defined |

**Gate result: PASS — no violations to justify.** Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-shell/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── route-table.md   # Phase 1 output (UI contract)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── main.jsx             # unchanged (mounts App)
├── App.jsx              # becomes the shell: BrowserRouter mount, skip link,
│                        #   Header, <Outlet/>, Footer, scroll/focus manager
├── routes.jsx           # NEW — single route table: path, label, nav group,
│                        #   owning module, page or placeholder flag
├── pages/
│   ├── Home.jsx         # NEW — the existing landing sections moved out of App.jsx
│   ├── Placeholder.jsx  # NEW — one shared labeled placeholder (FR-006)
│   └── NotFound.jsx     # NEW — unknown-URL page (FR-003)
├── rail.js              # untouched
├── motion.js            # untouched
└── styles.css           # untouched (ui-polish module owns styling later)

scripts/
└── self-check.mjs       # extended: route table ↔ nav consistency assertions
```

**Structure Decision**: Single SPA under `src/`. `App.jsx` keeps Header/Footer
(extracted in place, not moved to new component files) and owns the router;
landing sections move to `src/pages/Home.jsx`. Route table lives alone in
`src/routes.jsx` so router, header, footer, and mobile nav all read one list —
dead links become a build-time check, not a review question.

## Complexity Tracking

No constitution violations — nothing to justify.
