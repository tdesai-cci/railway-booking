# Tasks: Routing Shell

**Input**: Design documents from `/specs/001-shell/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested by the specification. Verification = `npm run build`,
`npm run check` (extended assertions), and the quickstart.md walk-through per
story.

**Organization**: Tasks grouped by user story (US1 navigate, US2 shareable
URLs, US3 honest placeholders) so each story is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths in every description

## Phase 1: Setup

**Purpose**: Dependency + landing-page extraction so the shell has somewhere to live

- [X] T001 Add react-router-dom to package.json (`npm install react-router-dom`)
- [X] T002 [P] Extract landing sections from src/App.jsx into src/pages/Home.jsx (Hero, Stats, Features, RouteCards, Steps, Testimonials, Faq, Cta and their data consts; Home renders standalone as before)

**Checkpoint**: Landing page still renders at `/` via the current single-page mount; `npm run build` passes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Route table + router shell every story needs

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create src/pages/Placeholder.jsx — shared labeled placeholder rendering `blurb`, `cta` (link), honoring constitution III (no new animation outside existing motion helpers) per data-model.md
- [ ] T004 [P] Create src/pages/NotFound.jsx — plain message + working link home (FR-003)
- [ ] T005 Create src/routes.jsx — route table per contracts/route-table.md: 9 site-map rows (path, label, nav group, owner), `homeAnchors: ["search","features","routes","how","faq"]`, single `path` uniqueness invariant (FR-008, data-model invariants 1–2)
- [ ] T006 Rework src/App.jsx into the shell: mount BrowserRouter, render Header + route outlet + Footer, generate `<Routes>` from the table with NotFound as catch-all (FR-001, FR-003)

**Checkpoint**: Foundation ready — every route in the table renders (placeholders minimal), unknown URLs show NotFound, `npm run build` + `npm run check` pass.

---

## Phase 3: User Story 1 - Navigate between pages (Priority: P1) 🎯 MVP

**Goal**: Every header/footer/mobile link resolves to a rendered page; wordmark returns home; mobile menu closes on navigation.

**Independent Test**: Click every link on every surface — zero dead links, URL changes, wordmark goes home, menu closes (quickstart scenarios 1–3).

### Implementation for User Story 1

- [ ] T007 [US1] Rewire Header in src/App.jsx: links derived from route table `nav` field; wordmark → `/`; "Check PNR"/"Sign in" → their routes; in-page anchors render as `/#<id>` (FR-002, FR-005)
- [ ] T008 [US1] Rewire mobile menu in src/App.jsx from the route table; close menu on any navigation, preserving `aria-expanded`/`aria-controls` (FR-002, FR-007)
- [ ] T009 [US1] Rewire Footer in src/App.jsx link columns (Book, Support, Company, legal row) from the route table; remove `href="#"` stubs (FR-002, FR-008)
- [ ] T010 [US1] Add route-table ↔ nav assertions to scripts/self-check.mjs per contracts/route-table.md rules 1–4 (unique paths starting with `/`, page xor placeholder, owner ∈ CAPABILITIES.md, nav labels ∈ table)
- [ ] T011 [US1] Verify: `npm run check` passes new assertions; `npm run build` passes; quickstart scenarios 1–3 manually confirmed

**Checkpoint**: US1 complete — navigation fully functional and independently demonstrable.

---

## Phase 4: User Story 2 - Shareable, resumable URLs (Priority: P2)

**Goal**: Refresh, fresh-tab paste, unknown URLs, Back/Forward, and cross-page anchors all behave per spec.

**Independent Test**: Paste each site-map URL into a fresh tab (renders, no home flash); paste `/nope` (NotFound); Back once per navigation returns previous page at top scroll (quickstart scenarios 4, 5, 7, 9, 10).

### Implementation for User Story 2

- [ ] T012 [US2] Add scroll/focus manager to src/App.jsx: on path change scroll to hash target if present else top; move focus to `<main>` (FR-004, FR-005, constitution III)
- [ ] T013 [US2] Verify cross-page anchors: clicking `/#search` from any sub-page lands on home scrolled to that section; anchor URLs refresh to their section (FR-005, spec edge case 1)
- [ ] T014 [US2] Verify: quickstart scenarios 4, 5, 7 (deep link, unknown URL, Back/Forward), 9 (reduced motion), 10 (keyboard-only pass) confirmed manually

**Checkpoint**: US1 + US2 both work; deep linking and resumption proven.

---

## Phase 5: User Story 3 - Honest placeholders (Priority: P3)

**Goal**: Routes owned by unbuilt modules show a labeled placeholder naming what will live there, with a working call to action — never blank or crashed.

**Independent Test**: Visit all 8 placeholder routes — each labels its future content and its CTA navigates somewhere real (quickstart scenario 8).

### Implementation for User Story 3

- [ ] T015 [P] [US3] Populate `placeholder: { blurb, cta }` for all 8 unbuilt-module rows in src/routes.jsx — plain, specific copy per constitution (name what the page will do), no invented figures (FR-006, voice constraint)
- [ ] T016 [US3] Verify: quickstart scenario 8 across all placeholder routes; confirm a placeholder row and a shipped page are mutually exclusive (data-model invariant 3)
- [ ] T017 [US3] Verify placeholders contain no fare/price figures and no IRCTC/IR marks (constitution I–II)

**Checkpoint**: All three stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 [P] Confirm Wikimedia photo attribution renders on home and footer after the split; wordmark/TrainMark/palette untouched (constitution II)
- [ ] T019 Remove dead code/anchors from src/App.jsx after rewiring; ensure no orphaned imports
- [ ] T020 Run full quickstart.md validation (all 10 scenarios) + `npm run build` + `npm run check` as final gate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup; **blocks all user stories**
- **US1 (Phase 3)**: depends on Foundational — MVP
- **US2 (Phase 4)**: depends on Foundational; independent of US1's nav rewiring (router already mounts in T006)
- **US3 (Phase 5)**: depends on Foundational (Placeholder component + rows); independent of US1/US2
- **Polish (Phase 6)**: after all desired stories

### Parallel Opportunities

- T003 ∥ T004 (different new files) — after T001
- T007/T008/T009 all touch src/App.jsx → **sequential**, not parallel
- T012 (App.jsx) ∥ T015 (routes.jsx) — US2 ∥ US3 possible after Foundational
- T018 ∥ T019

### Within Each Story

Structure/data → implementation → self-check assertions → manual quickstart
verification → checkpoint.

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2
2. Phase 3 (US1) → **STOP**: scenarios 1–3 pass = shippable navigation
3. US2, US3 add resumption and placeholders without breaking US1

### Incremental Delivery

Setup → Foundational → US1 (MVP demo) → US2 → US3 → Polish. Each checkpoint
leaves `npm run build` + `npm run check` green.

---

## Notes

- [P] = different files, no dependency conflicts; same-file tasks run sequentially
- Commit after each task or logical group (repo is now a git repo)
- Stop at any checkpoint to validate the story independently
- Placeholder pages are config-driven: a later module ships by swapping one
  `routes.jsx` row — no nav edits (contracts/route-table.md rule 5)
