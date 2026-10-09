# Research: Routing Shell (Phase 0)

All Technical Context unknowns resolved. Decisions in `Decision / Rationale /
Alternatives considered` format.

## 1. Router library

- **Decision**: `react-router-dom` (v7 line, the version Vite/React 19 supports).
- **Rationale**: FR-001/FR-004 (shareable URLs, Back/Forward) is a router
  problem; this is the de-facto standard, declarative, and zero-config with
  Vite. Already approved as the one new dependency in CAPABILITIES.md.
- **Alternatives considered**: hand-rolled History API (reimplements a router
  badly — deep-link, Back/Edge cases are exactly where hand-rolled routers
  rot); TanStack Router (type-system power we don't use in plain JS);
  hash-based router libs (unnecessary if the server can fall back to index.html).

## 2. BrowserRouter vs HashRouter

- **Decision**: `BrowserRouter` with clean paths (`/check-pnr`).
- **Rationale**: Vite's default `appType: "spa"` already rewrites unknown paths
  to `index.html` in dev and `vite preview`, so FR-002 is satisfied in every
  environment used today. Clean URLs match the "shareable URL" story.
- **Alternatives considered**: HashRouter (`/#/check-pnr`) works on any dumb
  static host but ships uglier URLs and a second navigation vocabulary.
- **Deployment caveat** (recorded, not blocking): the production static host
  must be configured to fall back to `index.html`. If a host can't, switching
  is a one-import change to `HashRouter`. See quickstart.md validation #6.

## 3. Single route table as the source of truth

- **Decision**: one array in `src/routes.jsx`; the router, header, footer, and
  mobile menu are all derived from it.
- **Rationale**: FR-002 ("no dead links") is enforced by construction and by a
  `npm run check` assertion instead of by review. Adding a page = one table row.
- **Alternatives considered**: separate nav configs per surface (links drift
  from routes — the exact bug this module exists to fix).

## 4. Placeholder strategy for unbuilt modules

- **Decision**: one `Placeholder.jsx` component rendered by route-table rows
  that carry `{ placeholder: true, blurb, cta }`. Later modules swap the row
  for a real page import.
- **Rationale**: FR-006 without nine stub files of noise; the placeholder is
  honest by construction (config names what will live there).
- **Alternatives considered**: per-page stub files (9 files, same content);
  hiding nav links until modules ship (rejected by the approved spec, FR-002).

## 5. Scroll and focus on route change

- **Decision**: a small manager inside `App.jsx`: on path change, scroll to
  the hash target if present (home anchors), otherwise scroll to top; move
  focus to `<main>` for screen-reader/keyboard continuity.
- **Rationale**: FR-004 requires top-scroll on navigation; FR-005 keeps
  `#search`-style anchors working, including arriving at `/#search` from
  another page. Focus reset prevents tabbing into the previous page's DOM.
- **Alternatives considered**: react-router's `<ScrollRestoration>` (a
  data-router API we don't need) — manual listener is 6 lines.

## 6. Verification approach

- **Decision**: extend `scripts/self-check.mjs` with string-level assertions —
  every nav path appears in the route table, every table row has a target,
  home anchors are flagged home-only — plus the quickstart manual walk-through.
- **Rationale**: the repo has no test framework and nav is render behavior;
  one runnable check (constitution workflow) gates regressions without adding
  a runner for a single feature.
- **Alternatives considered**: adding Vitest + component tests (real cost,
  right call when booking-flow adds testable logic — revisit in that module).
