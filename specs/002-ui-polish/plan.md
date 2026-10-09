# Implementation Plan: UI Polish — Buttons, Spacing, Responsive

**Branch**: `002-ui-polish` | **Date**: 2026-10-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-ui-polish/spec.md`

## Summary

Make every interactive control on the site feel finished and consistent
(complete hover/focus/pressed/disabled/busy states, one size per class),
tighten the landing's spacing and type onto shared tokens, and make every route
correct at 320–1440 px including production image rendering — all inside the
existing navy/saffron style with no new dependencies. Approach: additive token
categories + a global focus treatment + a button state matrix in the existing
stylesheet, verified by new static `self-check` rules and a browser walkthrough
(research R1–R7).

## Technical Context

**Language/Version**: JavaScript (ESM, JSX), React 19.1, Vite 7

**Primary Dependencies**: react-router-dom 7, framer-motion 12 (existing —
**no additions**; deps are ask-first)

**Storage**: N/A (frontend-only, no data)

**Testing**: `npm run check` → `scripts/self-check.mjs` (existing 145
assertions + new static UI rules); browser walkthrough vs `quickstart.md`
(dev server + preview + browser tooling)

**Target Platform**: Modern browsers; mobile-first (320 px up), WCAG 2.2 AA

**Project Type**: Single-page web application (single project)

**Performance Goals**: no layout shift on control state changes; state
transitions ≤ `--t-fast` (160 ms); images emitted by the build

**Constraints**: zero new dependencies; token values additive-only (constitution
II + ask-first); build + check green before every hand-off

**Scale/Scope**: 10 routes (home, 8 shell pages, 404); one 546-line stylesheet;
~7 button variants + 9 non-button control types (data-model §2)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Verdict | Notes |
|---|---|---|
| I. No Fee Surprises | **PASS** | No fare/price presentation is touched; search results and route-card prices render as-is |
| II. Brand Boundaries | **PASS** | Wordmark, train mark, navy↔saffron relationship untouched; tokens additive-only with 1:1 value mapping (research R3, R6) |
| III. Accessibility (WCAG 2.2 AA) | **PASS** | This module *is* the a11y gate work: focus visibility (FR-004), 24 px targets (FR-005), contrast preserved, reduced-motion paths kept (FR-010) |
| IV. One Destination, Two Speeds | **PASS** | `--ok`/`--warn` availability semantics and urgency cues preserved as tokens (data-model invariant 4) — polish may not flatten them |
| V. Honest Motion, Boring Code | **PASS** | No new animation system, no deps; CSS states + existing `--t-*`/`--ease`; Framer config left in place (research R1, R7) |
| Workflow: build/check gates, ask-first (deps, routing, tokens) | **PASS** | No routing/deps changes; token additions are approved by this plan's human gate — any *value* change stays ask-first |

**Post-design re-check**: PASS — Phase 0/1 artifacts (research, data-model,
contracts, quickstart) introduce no new gates or violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-polish/
├── plan.md              # This file
├── spec.md              # Approved specification
├── research.md          # Phase 0 — audit facts + decisions R1–R7
├── data-model.md        # Phase 1 — token catalog + control inventory
├── quickstart.md        # Phase 1 — 10 validation scenarios
├── contracts/
│   └── control-states.md  # Button/control state & sizing matrix
├── checklists/
│   └── requirements.md    # Spec quality checklist (16/16)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── styles.css           # Token block + all state/spacing/type fixes land here
├── App.jsx              # Shell chrome (header/footer/burger) state tweaks
├── pages/
│   ├── Home.jsx         # Type tokens inline, route-card image imports
│   ├── Placeholder.jsx  # Chrome consistency
│   └── NotFound.jsx     # Chrome consistency
scripts/
└── self-check.mjs       # + static rules: dup-hex, focus, states
assets/                  # 4 route jpgs referenced via imports (unchanged location)
```

**Structure Decision**: single project, in-place edits (research R1). No new
files except none — polish changes existing files only; artifacts stay in
`specs/002-ui-polish/`.

## Task List

### Phase 1 — Foundations: tokens + focus (US1)

- [ ] **T001**: Add token categories to `:root` — type scale (`--fs-*`,
      values 1:1 from current literals), `--surface`, focus ring
      (`--focus-ring/-w/-off`), control heights (`--ctl-h-sm/md`),
      `--tap-min:24px`. *Acceptance*: additive only, rendered sizes unchanged.
      *Verify*: `npm run build` + `npm run check`; visual no-change spot check.
      *Files*: `src/styles.css`
- [ ] **T002**: Global `:focus-visible` treatment (outline + offset from
      tokens) for all interactive elements, plus dark-surface variant; absorb
      the 2 legacy `:focus{` rules. *Acceptance*: FR-001/FR-004 — ring visible
      on hero, white, accent surfaces; no layout shift. *Verify*: quickstart S1.
      *Files*: `src/styles.css`
- [ ] **T003**: Button state matrix — `:active`, `:disabled`, busy styling for
      all `.btn` variants; heights/radius/padding defined once per size class
      (base, `sm`). *Acceptance*: contract matrix rows render distinct states,
      same-class buttons identical across pages. *Verify*: quickstart S2+S3.
      *Files*: `src/styles.css`

**Checkpoint 1**: `npm run build` + `npm run check` green; focus + button
state pass on `/` and `/check-pnr`.

### Phase 2 — Type hierarchy & consistency (US2)

- [ ] **T004**: Map font-size literals → `--fs-*` tokens (12 CSS literals +
      2 inline JSX). *Acceptance*: zero raw `font-size` literals left; sizes
      byte-identical. *Verify*: build + visual no-change; check green.
      *Files*: `src/styles.css`, `src/pages/Home.jsx`
- [ ] **T005**: Dup-hex cleanup — `#fff`→`--surface` (43×) and every color
      repeating outside `:root` → tokens; singletons stay. *Acceptance*:
      no hex outside `:root` occurs more than once. *Verify*: new self-check
      rule (T009) green. *Files*: `src/styles.css`
- [ ] **T006**: Non-button control states per contract (`.tab`, `.ctl`,
      `.burger`, nav/footer links) + shell chrome (Placeholder/NotFound
      spacing & type from tokens). *Acceptance*: contract rows complete;
      shell pages inherit landing language. *Verify*: quickstart S2 + S8.
      *Files*: `src/styles.css`, `src/pages/Placeholder.jsx`,
      `src/pages/NotFound.jsx`

**Checkpoint 2**: `npm run build` + `npm run check` green; heading outline
h1→h2→h3 clean on home.

### Phase 3 — Responsive & production imagery (US3)

- [ ] **T007**: Route-card images via module imports (4 jpgs) — resolves
      FR-009 (broken in prod today). *Acceptance*: `dist/assets/route-*.jpg`
      emitted; photos render in preview. *Verify*: quickstart S6.
      *Files*: `src/pages/Home.jsx`
- [ ] **T008**: Width sweep fixes — 320/768/1024/1440 across all 10 routes:
      horizontal overflow, clipping/overlap, touch targets ≥24 px.
      *Acceptance*: FR-008/FR-005 pass at all four widths. *Verify*:
      quickstart S4+S5. *Files*: `src/styles.css`, `src/App.jsx`

**Checkpoint 3**: build + check green; no horizontal scroll anywhere; photos
visible in production build.

### Phase 4 — Verification

- [ ] **T009**: Self-check additions — static rules: dup-hex (from T005),
      focus-visible rule exists for `.btn`, `.btn:active` + `:disabled`
      exist, all existing 145 assertions still pass. *Acceptance*:
      `npm run check` reports all rules green. *Verify*: `npm run check`.
      *Files*: `scripts/self-check.mjs`
- [ ] **T010**: Full quickstart validation (all 10 scenarios) + final gates.
      *Acceptance*: every scenario's expected outcome met; constitution
      attribution/brand check (S9) intact. *Verify*: `npm run build` +
      `npm run check` + walkthrough. *Files*: none (execution)

**Final Checkpoint**: All spec success criteria SC-001…SC-007 demonstrated;
ready for `/speckit.converge` / module closure.

**Ordering notes**: T001→T002→T003 strictly sequential (focus ring consumes
new tokens; matrix consumes focus). T004/T005 follow T001. T007 shares
`Home.jsx` with T004 — run after T004. T008 after Phases 1–2 settle layout.
T009 asserts rules created by T002/T003/T005 — placed in Phase 4 so one write
covers all three.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Focus ring fails 3:1 on accent (orange) or navy surfaces | High — constitution III blocks ship | Dark-surface variant (R2) measured during T002; quickstart S1 covers all three surface types |
| Token mapping shifts rendering (rem rounding, cascade order) | Med — visual regressions | Strict 1:1 value mapping (R3/R6); visual no-change checks at Checkpoints 1–2 |
| Width sweep uncovers structural layout work beyond "polish" | Med — scope creep | Spec bounds it: fix overflow/clip/touch targets only; redesign = new module |
| Dup-hex rule flushes more repeats than the audit found | Low — extra token rows | Additive tokens are cheap and pre-approved by this plan |
| Inline-style cleanup collides with Framer motion props | Low | R7 boundary: spacing/type → CSS classes; motion config stays inline |

## Open Questions

None — scope pinned by spec + research decisions.

## Complexity Tracking

No constitution violations to justify (all gates PASS; no complexity table
entries).
