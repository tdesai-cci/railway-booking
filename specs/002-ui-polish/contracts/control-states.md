# Contract: Control States & Sizing (the "buttons" contract)

UI contract for `002-ui-polish`. Every control class listed here must satisfy
the matrix; `npm run check` asserts the static half, the quickstart walkthrough
asserts the visual half.

## Size classes

| Class | Min height | Use | Target floor |
|---|---|---|---|
| `.btn` (base) | `--ctl-h-md` | page CTAs, form submit | ≥ 24×24 px (`--tap-min`) everywhere |
| `.btn-sm` | `--ctl-h-sm` | header CTAs, train-row "Book now" | ≥ 24×24 px |
| non-button controls (`.tab`, `.swap`, stepper ±, `.burger`, links) | own rules | — | ≥ 24×24 px; comfortable spacing on touch |

Invariant: **height, radius, padding and label typography for a size class are
defined once** (base `.btn` rule + `.btn-sm`), variant rules may change color
only (FR-003, SC-007).

## State matrix

States: **rest · hover · active(pressed) · focus-visible · disabled · busy**

| Control | rest | hover | active | focus-visible | disabled | busy |
|---|---|---|---|---|---|---|
| `.btn-primary` / `.btn-accent` | ✓ | ✓ | ✓ | ✓ ring | ✓ (submit during search) | ✓ ("Searching" label) |
| `.btn-ghost` / `.btn-white` / `.btn-onhero` | ✓ | ✓ | ✓ | ✓ ring | n/a (no disabled usage) | n/a |
| `.btn-sm` (Book now) | inherits variant states | ✓ | ✓ | ✓ ring | n/a | n/a |
| `.tab` (trip type) | ✓ | ✓ | ✓ | ✓ ring | n/a | n/a (aria-selected marks state) |
| `.swap` | ✓ | ✓ (spin on hover ok) | ✓ | ✓ ring | n/a | n/a |
| stepper ± | ✓ | ✓ | ✓ | ✓ ring | ✓ at pax bounds (existing) | n/a |
| `.ctl` select/date | ✓ | ✓ | — | ✓ ring | n/a | n/a |
| `.burger` | ✓ | ✓ | ✓ | ✓ ring | n/a | ✓ via `aria-expanded` visual |
| nav/footer text links | ✓ | ✓ (existing underline) | ✓ | ✓ ring | n/a | n/a |

Rules:

1. **FR-001**: every row's applicable states actually render a distinct,
   perceivable appearance (not just browser default where we've overridden
   hover).
2. **FR-002/SC-006**: no state changes layout — size stays fixed through
   hover→active→disabled→busy (outline/box-shadow only, no border-width jumps).
3. **FR-004**: the focus ring is the shared `--focus-visible` treatment
   (outline + offset + token color), with a dark-surface variant; ring contrast
   ≥ 3:1 against what surrounds it, on navy hero, white sections and accent
   fills alike.
4. **FR-005**: every control ≥ 24×24 CSS px (WCAG 2.2 AA §2.5.8).
5. **FR-010**: hover/active transitions use `--t-fast`/`--ease` and are
   neutralized under `prefers-reduced-motion`; a state is never signalled by
   motion alone (color/opacity/underline carries it).
6. **Busy/announced**: submit's busy state keeps the results `aria-live`
   region as the feedback channel; the button itself swaps label/icon without
   resizing.

## Traceability

- FR-001, FR-003 → rows 1 (state presence) + size-class invariant
- FR-002, SC-006 → rule 2
- FR-004 → rule 3 · FR-005 → rule 4 · FR-010 → rule 5
- FR-006/FR-007/FR-012 → tokens referenced by these rules come from the
  catalog in [data-model.md](../data-model.md)
