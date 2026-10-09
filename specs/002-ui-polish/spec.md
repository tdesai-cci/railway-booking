# Feature Specification: UI Polish — Buttons, Spacing, Responsive

**Feature Branch**: `002-ui-polish`

**Created**: 2026-10-09

**Status**: Draft

**Input**: User description: "ok next do ui polish. check the buttons and all"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive elements feel finished and consistent (Priority: P1)

A visitor moves through the site — search form, header, footer, buttons of
every kind — and every control responds the same way: it highlights on hover,
shows a clear keyboard focus ring, gives pressed feedback, and disables cleanly
while work is in flight. Nothing looks like a leftover from a different page.

**Why this priority**: The user explicitly asked to "check the buttons and
all"; control states are the most-touched UI surface and the biggest
consistency risk across the landing and the shell pages built after it.

**Independent Test**: Audit every button, button-styled link, and form control
on the home page and shell pages: each shows hover, visible keyboard focus,
pressed, and (where applicable) disabled/loading states — fully testable
without the other stories.

**Acceptance Scenarios**:

1. **Given** any page, **When** a keyboard user tabs through every interactive
   control, **Then** each control shows a focus indicator clearly visible
   against its background (including the dark hero and saffron buttons).
2. **Given** a control that triggers work (e.g. Search Trains), **When** it
   enters its busy/disabled state, **Then** it shows that state without
   changing size and without shifting surrounding layout.
3. **Given** two buttons of the same size class (e.g. header CTA and landing
   CTA), **When** compared side by side, **Then** height, corner radius,
   padding and label typography match.
4. **Given** a touch user on a phone, **When** they tap any control, **Then**
   the target is at least 24×24 CSS px (WCAG 2.2 AA).

---

### User Story 2 - Landing rhythm and type hierarchy tightened (Priority: P2)

Sections on the home page breathe with a consistent spacing rhythm; heading
sizes follow one scale; alignments line up. The page reads as one designed
system rather than assembled parts, and shell pages inherit the same language.

**Why this priority**: The capability map lists spacing and type hierarchy as
this module's core responsibility; the value is most visible once controls
(P1) are already consistent.

**Independent Test**: Compare section gaps, heading levels and shell-page
chrome against the shared spacing/type scale; every value matches a shared
definition and no one-off values remain.

**Acceptance Scenarios**:

1. **Given** consecutive landing sections, **When** inspected, **Then**
   vertical gaps come from a single spacing scale (no one-off values).
2. **Given** the page outline of any current page, **When** read, **Then**
   heading levels step h1 → h2 → h3 with sizes from a single type scale.
3. **Given** a shell page (e.g. Help & contact), **When** viewed, **Then** it
   uses the same header, footer and spacing language as the landing page.

---

### User Story 3 - Correct on every screen size, in production (Priority: P3)

A visitor on a 320 px phone, a tablet, or a wide desktop sees the same
content with no sideways scrolling, no clipped or overlapping elements, and
all photos actually rendering — including in the production build.

**Why this priority**: Responsive fixes are named in the module scope and
depend on the layout being settled by P1/P2 first.

**Independent Test**: Load every current route at 320/768/1024/1440 px widths
from a production build: no horizontal scrollbar, no overlap, every image
loads.

**Acceptance Scenarios**:

1. **Given** any route at 320 px width, **When** loaded, **Then** no
   horizontal scrolling is needed and no content is clipped.
2. **Given** the landing route cards in a production build, **When** loaded,
   **Then** all four route images render (today they fail outside development).
3. **Given** any route at 200% zoom, **When** viewed, **Then** content reflows
   without loss of information or function.

---

### Edge Cases

- Dark hero background: focus indicators and hover states must stay visible on
  both the navy hero and white sections, and on saffron/accent fills.
- Reduced motion: state changes must remain perceivable when animation is
  turned off — no state communicated only by movement.
- Busy/loading states: must not resize the control or shift neighbors while
  the label or icon changes.
- Long button labels at 320 px: wrapping must not break row layout.
- Placeholder pages: polish applies to their chrome (header, footer,
  controls) without inventing page content — placeholders stay labeled.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every interactive control (buttons, button-styled links, form
  fields, burger menu button) MUST expose hover, visible keyboard-focus, and
  pressed states.
- **FR-002**: Controls that trigger work (e.g. Search Trains) MUST expose
  disabled/busy states that do not change the control's size or shift
  surrounding layout.
- **FR-003**: Button variants MUST be internally consistent: each size class
  has one height, corner radius, padding and label style, used identically on
  every page.
- **FR-004**: Focus indicators MUST be clearly visible against every
  background they appear on (dark hero, white sections, accent fills) per
  WCAG 2.2 AA.
- **FR-005**: All interactive targets MUST be at least 24×24 CSS px (WCAG
  2.2 AA), with comfortable spacing on touch screens.
- **FR-006**: Landing spacing MUST follow a single shared spacing scale, and
  type sizes a single shared scale (design tokens), with no duplicate
  one-off values.
- **FR-007**: Heading structure MUST step h1 → h2 → h3 per page, sized from
  the shared type scale.
- **FR-008**: Every current route (home, 8 shell pages, not-found) MUST
  render without horizontal scrolling at 320 px and without clipped or
  overlapping content at 768/1024/1440 px.
- **FR-009**: All imagery referenced by the site MUST render in the
  production build, not only during development.
- **FR-010**: Any motion adjustments MUST honor prefers-reduced-motion and
  reuse the site's existing motion behavior — no new animation system
  (constitution III).
- **FR-011**: Visual changes MUST NOT alter the wordmark, palette
  relationships, photo attribution, or copy voice (constitution, PRODUCT.md
  brand commitments).
- **FR-012**: Shared design tokens MUST cover every recurring visual value
  (spacing, radius, type size, color, duration) so future pages
  (booking-flow, info-pages) can be built consistently.

### Key Entities

*(none — this feature involves no data.)*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of interactive controls show a visible keyboard focus
  indicator on every page (audit finds 0 missing).
- **SC-002**: 0 routes show horizontal scrolling at 320 px width; 0
  overlapping or clipped elements at the four checked widths (320/768/1024/1440).
- **SC-003**: Button audit reports 0 controls missing hover/pressed states
  and 0 size/radius mismatches within a size class.
- **SC-004**: 100% of referenced images render in the production build
  (0 broken images).
- **SC-005**: 100% of interactive targets meet the 24×24 px minimum size.
- **SC-006**: State changes (hover → pressed → disabled) cause 0 px layout
  shift around the control.
- **SC-007**: A side-by-side check of any two same-class buttons on different
  pages shows no visual difference in height, radius, padding or label style.

## Assumptions

- Scope is **all currently shipped pages** (home + 8 shell routes +
  not-found). Future booking-flow pages inherit the shared tokens but are
  not styled in this module.
- "Polish" means consistency, responsiveness and accessibility fixes **within
  the existing navy/saffron style** — not a redesign. Wordmark and palette
  relationships are binding (CAPABILITIES.md Decisions, PRODUCT.md brand
  commitments).
- No new dependencies, no backend work, and no copy rewrites beyond minor
  label fixes needed for consistency.
- The pre-existing production-only failure of the four route-card images
  (root assets not published into build output) is in scope as a visual
  defect (FR-009).
- Placeholder pages keep their simple labeled layout; this module polishes
  their surrounding chrome only.
- Dark mode is out of scope (single theme by design).
