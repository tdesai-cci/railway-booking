# Tasks: UI Polish — Buttons, Spacing, Responsive

**Input**: Design documents from `/specs/002-ui-polish/`

**Prerequisites**: plan.md (approved), spec.md (approved), research.md, data-model.md, contracts/control-states.md, quickstart.md

**Tests**: Not requested by the specification — no test tasks. Verification is
`npm run build` + `npm run check` (static rules, T015) + browser walkthroughs
vs quickstart.md (verify tasks).

**Organization**: Tasks are grouped by user story so each story can be
implemented and tested independently. Refines the approved plan's Task List
(plan phases → story phases; plan T006 split across US1/US2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline so polish regressions are attributable

- [ ] T001 Verify clean baseline: `npm run build` and `npm run check` both pass on unmodified code (145 assertions green)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The additive token categories every story consumes (data-model §1, research R3/R6 — values 1:1, nothing existing changes)

**?? CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Add additive tokens to `:root` in src/styles.css: type scale (`--fs-xs .75rem`, `--fs-sm .8125rem`, `--fs-md .875rem`, `--fs-base .9375rem`, `--fs-lg 1.0625rem`, `--fs-h1/h2/h3` + `--fs-lead` = existing clamp values), `--surface:#fff`, focus ring (`--focus-ring`, `--focus-ring-w`, `--focus-ring-off`), control heights (`--ctl-h-sm`, `--ctl-h-md`), `--tap-min:24px` (invariant: existing token values byte-identical, constitution II)

**Checkpoint**: Foundation ready — US1/US2/US3 can start; T012 may run any time after this (its file is disjoint from US1)

---

## Phase 3: User Story 1 - Interactive elements feel finished and consistent (Priority: P1) ?? MVP

**Goal**: Every control shows hover/pressed/focus/disabled/busy states from one shared treatment; same size class = same geometry everywhere (contract: control-states.md)

**Independent Test**: Tab through `/` and `/check-pnr`: every control shows the focus ring on navy hero, white sections and accent fills (quickstart S1); hover→press each variant with no size change (S2); submit search: busy state with no neighbor shift (S3)

### Implementation for User Story 1

- [ ] T003 [US1] Global `:focus-visible` treatment (outline + offset from `--focus-ring*` tokens) for all interactive elements, plus dark-surface variant; absorb the 2 legacy `:focus{` rules in src/styles.css (FR-001, FR-004)
- [ ] T004 [US1] Button state matrix in src/styles.css: distinct `:active`, `:disabled`, and busy styling for `.btn-primary/.btn-accent/.btn-ghost/.btn-white/.btn-onhero` (+ `.btn-sm`); height/radius/padding defined once per size class so variant rules change color only (contracts/control-states.md rules 1–3, FR-002, FR-003)
- [ ] T005 [US1] Non-button control states in src/styles.css per contract matrix: `.tab` (incl. aria-selected look), `.ctl` select/date, `.burger` (open + focus), `.swap`, stepper ± (disabled at bounds), nav/footer text links; all targets ≥ `--tap-min` (FR-001, FR-005)
- [ ] T006 [US1] Verify US1: quickstart S1–S3 browser pass (focus ring on 3 surface types, state matrix, zero layout shift on state change)

**Checkpoint**: US1 independently testable — MVP demo point

---

## Phase 4: User Story 2 - Landing rhythm and type hierarchy tightened (Priority: P2)

**Goal**: One spacing scale, one type scale, h1→h2→h3 per page; shell pages inherit landing's chrome language (FR-006, FR-007)

**Independent Test**: Walk quickstart S8 — section gaps and type sizes all resolve to tokens (dup-hex/type-literal scan clean); heading outline steps correctly on every page; S9 confirms attribution + wordmark untouched

### Implementation for User Story 2

- [ ] T007 [US2] Map all font-size literals → `--fs-*` tokens in src/styles.css and the 2 inline `fontSize` values in src/pages/Home.jsx — rendered sizes byte-identical (FR-006, FR-007)
- [ ] T008 [US2] Dup-hex cleanup in src/styles.css: `#fff` (43×) → `--surface`, every color repeating outside `:root` → new/existing tokens; singletons remain literals (research R3, FR-006)
- [ ] T009 [US2] Landing section rhythm in src/styles.css: section paddings/gaps resolve to `--s*` scale; replace any one-off spacing values (FR-006)
- [ ] T010 [US2] Shell chrome consistency in src/pages/Placeholder.jsx, src/pages/NotFound.jsx and src/styles.css: heading levels/sizes from `--fs-*`, spacing from `--s*`, same rhythm as landing (FR-007)
- [ ] T011 [US2] Verify US2: quickstart S8 + S9 browser pass (token-resolved spacing/type, heading outline, 7 Wikimedia credits, wordmark/palette untouched)

**Checkpoint**: US2 independently testable; US1 still green

---

## Phase 5: User Story 3 - Correct on every screen size, in production (Priority: P3)

**Goal**: No horizontal scroll at 320 px, no clipping at 768/1024/1440, 200% zoom reflow, route-card photos render in the production build (FR-005, FR-008, FR-009)

**Independent Test**: quickstart S4–S6 — 10 routes × 4 widths overflow-free; preview build shows all four route photos (previously 404)

### Implementation for User Story 3

- [ ] T012 [P] [US3] Route-card images via module imports in src/pages/Home.jsx (4 jpgs: `../../assets/route-*.jpg`) so Vite emits them to dist — fixes production-only broken images (FR-009). *[P]: disjoint from styles.css work; coordinate with T007 (same file) — run before or after it*
- [ ] T013 [US3] Width sweep fixes in src/styles.css (and src/App.jsx only if header/footer cause overflow): horizontal overflow, clipping/overlap at 320/768/1024/1440; touch targets ≥ 24 px (FR-005, FR-008)
- [ ] T014 [US3] Verify US3: quickstart S4–S6 browser pass (4 widths × 10 routes, 200% zoom, `dist/assets/route-*.jpg` present in preview)

**Checkpoint**: All three stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Static enforcement + final gate for everything above

- [ ] T015 Static UI rules in scripts/self-check.mjs: no hex color outside `:root` occurs more than once; `.btn:focus-visible`, `.btn:active`, `.btn:disabled` rules exist; all pre-existing assertions still green (FR-001…FR-006 enforcement)
- [ ] T016 Final gate: full quickstart.md validation (all 10 scenarios) + `npm run build` + `npm run check` — SC-001…SC-007 demonstrated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none — starts immediately
- **Foundational (Phase 2)**: depends on Setup; **BLOCKS all user stories**
- **US1 (Phase 3)**: after Foundational — no other story dependencies
- **US2 (Phase 4)**: after Foundational; shares `styles.css` with US1 → run after US1 (sequential in one-session execution)
- **US3 (Phase 5)**: T012 anytime after Foundational (disjoint file, coordinate with T007); T013 after US1+US2 settle layout
- **Polish (Phase 6)**: after all stories; T015 rules assert T003/T004/T008 outputs

### User Story Dependencies

- **US1 (P1)**: starts after Foundational — independently testable (MVP)
- **US2 (P2)**: starts after Foundational — independently testable; practically ordered after US1 because both edit `src/styles.css`
- **US3 (P3)**: T012 independent; T013 benefits from US1/US2 being final

### Parallel Opportunities

- T012 `[P]` vs US1's T003–T005 (Home.jsx ∥ styles.css)
- T001 runs alone (baseline must be clean first)
- All other tasks share `src/styles.css` → sequential (same-file conflict)

### Sequential-in-story rule

Every task touching `src/styles.css` runs one at a time; verify with
`npm run check` after each group.

---

## Parallel Example: User Story 3

```text
Task T012 [P]: "Route-card images via module imports in src/pages/Home.jsx"
  → runs alongside US1 tasks (T003–T005) which only touch src/styles.css
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: T001 baseline
2. Phase 2: T002 tokens (CRITICAL — blocks everything)
3. Phase 3: T003–T005 → **STOP and VALIDATE** US1 (T006, quickstart S1–S3)
4. Demo: buttons/controls feel finished site-wide

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → verify (S1–S3) → commit (MVP)
3. US2 → verify (S8–S9) → commit
4. US3 → verify (S4–S6) → commit
5. Polish → T015 rules + T016 final gate → module complete

### Checkpoints (stop and validate)

- After T006: US1 MVP — focus + state matrix proven
- After T011: US2 — token discipline proven
- After T014: US3 — responsive + prod images proven
- After T016: all SC-001…SC-007 demonstrated → `/speckit.converge`

---

## Notes

- `**[P]**` marker = different files, no dependencies; everything else serial (shared stylesheet)
- Commit after each story/checkpoint; keep `npm run build` + `npm run check` green at every commit
- Token rule: additive only — never edit an existing token value (constitution II, ask-first)
- No new dependencies; no routing changes (plan Constitution Check)
