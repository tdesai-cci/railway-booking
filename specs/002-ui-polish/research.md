# Research: 002-ui-polish

Phase 0 output. Audit facts first, then decisions. All unknowns from the
plan's Technical Context are resolved here.

## Audit facts (baseline, 2026-10-09)

- `src/styles.css`: 546 lines; token block `:root` = lines 7–62 (color,
  fonts, spacing `--s1..s9`, radii, shadows, durations, easings).
- State coverage across the sheet: `:hover` ×31, `:focus-visible` ×4,
  `:focus{` ×2, `:active` ×1, `:disabled` ×2. **Hover-rich, focus/active/
  disabled sparse** — the core of "check the buttons".
- Button selectors: `.btn`, `.btn-accent`, `.btn-ghost`, `.btn-onhero`,
  `.btn-primary`, `.btn-white`, `.btn-sm`. Plus non-`.btn` controls: `.tab`,
  `.swap`, `.stepper` buttons, `.ctl` fields, `.burger`, nav/footer links.
- Breakpoints in use: 1000/900/760/640/400 px + `prefers-reduced-motion`.
- Font sizes: 12 distinct literals in CSS; repeats — `.75rem` ×8, `.8125rem`
  ×8, `.9375rem` ×7 (+2 inline in JSX), `.875rem` ×7, `1.0625rem` ×4; five
  `clamp()` display sizes ×1 each (the heading scale, unnamed).
- Hex colors outside `:root`: 17 distinct values on 67 lines — `#fff` ×43,
  `#F3F7FE` ×5, `#CBD5E1` ×3, `#A8BEE2` ×2, `#6EE7B7` ×2, 12 singletons
  (mostly decorative gradient stops).
- Images: 8 jpgs at repo-root `assets/`; no `public/` dir. CSS-referenced
  images (hero, stat, band) are hashed into `dist/` by the build; the four
  route cards reference `/assets/route-*.jpg` from a JS inline style, so they
  are **not** emitted — broken in production only (spec FR-009).

## Decisions

### R1 — Polish happens in place: `styles.css` + component edits, no new tools

**Decision**: Fix states, spacing and type in the existing stylesheet and the
existing components. No CSS framework, no design-token tooling, no new
dependency.
**Rationale**: Constitution V (boring code) and the ask-first rule for
dependencies; the sheet is 546 lines and already tokenized.
**Alternatives considered**: Tailwind/utility layer (rejected — new dependency,
full restyle = redesign, which the spec excludes); Style Dictionary/token
pipeline (rejected — frontend-only demo, tooling is heavier than the output).

### R2 — One focus treatment: global `:focus-visible` outline + token

**Decision**: A single visible focus style — outline with offset, width/color
from a new `--focus-ring` token — applied globally to interactive elements,
with one variant for dark surfaces (hero, footer) where the default ring needs
the light counterpart.
**Rationale**: FR-001/FR-004; `outline` never shifts layout (SC-006) and the
2 existing `:focus{` rules are inconsistent. WCAG 2.2 AA focus appearance is
satisfied by ≥2 px ring at ≥3:1 against adjacent colors.
**Alternatives considered**: `box-shadow` ring (rejected — same effect, more
rules, can be clipped by `overflow:hidden` parents); per-component rings
(rejected — that is the inconsistency being fixed).

### R3 — Tokens are additive-only; existing values and relationships untouched

**Decision**: Add missing token categories (type scale, surface `--surface:#fff`,
focus ring) and map existing literals to them **1:1 — values do not change**.
No existing token value is edited; wordmark, palette relationship and train
mark untouched (Principles II). Any *value* change, if ever wanted, is
ask-first and out of this module.
**Rationale**: Satisfies the constitution's ask-first rule for token changes —
the additions themselves are approved by this plan's gate.
**Alternatives considered**: renaming/restructuring the token set (rejected —
pure churn, touches every rule for zero visual gain).

### R4 — Route-card images fixed via JS imports, not `publicDir`

**Decision**: Import the four route jpgs at module scope in `pages/Home.jsx`
(`import routeDelhiMumbai from "../../assets/route-delhi-mumbai.jpg"`), store
resolved URLs in the existing `ROUTES` data.
**Rationale**: Vite emits them hashed into `dist/assets/`; works in dev and
prod; no config change; CSS-referenced images keep working untouched.
**Alternatives considered**: `publicDir` config change (rejected — either moves
files to dist root breaking `/assets/…` URLs or moves CSS-referenced files,
breaking the three hashed images); duplicating files into `public/` (rejected —
repo bloat, two sources of truth).

### R5 — Verification: static self-check rules + browser passes, no new test dep

**Decision**: Extend `scripts/self-check.mjs` with static rules — no hex color
outside `:root` may occur more than once (duplicates must become tokens), a
focus-visible rule must exist for the button base, `.btn:active`/`:disabled`
must exist, and the existing 145 assertions stay green. Visual/responsive/state
verification is a manual + browser-tool pass against `quickstart.md`, same
method `001-shell` used.
**Rationale**: `npm run check` is the constitution's runnable-check gate;
browser passes need no repo dependency (MCP tooling is already available).
**Alternatives considered**: adding Playwright as a devDependency (rejected —
ask-first dependency for a demo repo); axe-core integration (rejected — the
spec's SCs are auditable with focus/size/overflow checks we can script ourselves).

### R6 — Type scale: semantic tokens mapped 1:1 from existing literals

**Decision**: Name the existing sizes (`--fs-xs` … `--fs-lg` for the repeats,
`--fs-h1`…`--fs-h3` + `--fs-lead` for the five `clamp()`s) and replace
literals with `var()` references. Every rendered size stays byte-identical.
Inline JSX `fontSize` literals (2× `.9375rem`) join the same token.
**Rationale**: FR-006/FR-007/FR-012 — one scale, no one-off values, zero
visual risk.
**Alternatives considered**: adjusting sizes while naming them (rejected —
that is a redesign decision, not polish; would need new approval).

### R7 — One-off inline styles in JSX move to classes only when they encode spacing/type

**Decision**: Inline `style={{}}` props that repeat spacing/font values (e.g.
Faq question padding/font-size, `background:"#fff"` section wrappers) become
classes in `styles.css` using tokens. Motion configuration (variants, hover-y,
transitions) stays inline — it is Framer config, not CSS.
**Rationale**: FR-006 (no one-off values) without ripping apart working motion
setup (Principles V).
**Alternatives considered**: full inline-style extraction (rejected — touches
motion wiring for no visual gain).
