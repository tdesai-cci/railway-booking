# Data Model: 002-ui-polish

No entities or persistence (frontend-only polish). The "data" of this module
is the **design token catalog** plus the **control inventory** the contract
operates on.

## 1. Design token catalog

Source of truth: `:root` in `src/styles.css` (lines 7–62 today).

| Category | Existing tokens | Added by this module |
|---|---|---|
| Color — brand | `--brand-50…900` | — (values frozen, relationship frozen) |
| Color — accent | `--accent-50…700` | — (values frozen) |
| Color — ink/status | `--ink`, `--ink-2`, `--body`, `--muted*`, `--line*`, `--ok`, `--warn`, avatars | `--surface` (`#fff` — the 43× literal), plus recurring one-offs surfaced by the dup-hex rule (e.g. `#F3F7FE`, `#CBD5E1`) if they repeat after cleanup |
| Type scale | fonts `--font`, `--display` | `--fs-xs .75rem`, `--fs-sm .8125rem`, `--fs-md .875rem`, `--fs-base .9375rem`, `--fs-lg 1.0625rem` (values = current literals), `--fs-h1/h2/h3`, `--fs-lead` = the five existing `clamp()` display sizes |
| Spacing | `--s1…s9` (4/8 dp) | — |
| Radii | `--r-sm…pill` | — |
| Elevation | `--sh-sm…xl`, `--sh-on-dark` | — |
| Motion | `--t-fast/base/slow`, `--ease`, `--ease-in` | — |
| Focus | — | `--focus-ring` (color), `--focus-ring-w` (width), `--focus-ring-off` (offset) |
| Control sizing | — (`.btn` sizes baked into rules) | `--ctl-h-sm`, `--ctl-h-md` (min heights per size class) and `--tap-min: 24px` (WCAG 2.2 AA target floor) |

### Invariants (validation rules)

1. **Additive-only**: no existing token value changes; the navy/saffron
   relationship and wordmark are untouched (constitution II).
2. **Contrast**: every token whose comment claims a ratio keeps it; white text
   on any button-surface token ≥ 4.5:1 (constitution III). New surface/focus
   tokens must meet ≥3:1 against their adjacent colors (focus) / ≥4.5:1 under
   white labels (surfaces).
3. **Dup-hex rule**: after the mapping, no hex color outside `:root` may appear
   more than once in `styles.css` — repeats must be tokens (FR-006/FR-012,
   enforced by `npm run check`).
4. **Semantics preserved**: `--ok`/`--warn` and their availability-bar usage
   keep meaning (constitution IV — urgency cues are not flattened by polish).

## 2. Control inventory (what the contract covers)

| Surface | Controls |
|---|---|
| Buttons (`.btn` × variants) | `primary`, `accent`, `ghost`, `white`, `onhero`; sizes: base, `sm` |
| Header | nav links, CTA buttons, wordmark link, burger (`aria-expanded`) |
| Search form | `.tab` (role=tab), selects `.ctl`, date input, `.stepper` ± (`disabled` at bounds), submit (busy state), `.swap` |
| Results | train rows, "Book now" `.btn-primary btn-sm` |
| Footer | column links, legal links, credit links (external) |
| Placeholders / 404 | single CTA button each |

Sizes and states per control are specified in
[contracts/control-states.md](contracts/control-states.md).
