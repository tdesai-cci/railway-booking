# Feature Specification: Routing Shell

**Feature Branch**: `001-shell`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Add the app routing shell. The site stops being a single anchor-scrolled page: header, footer, and mobile navigation link to real pages (Check PNR, Sign in, My Bookings, Help, About, Refund policy, Privacy, Terms). Every page has a shareable URL; browser back/forward and refresh work; unknown URLs show a not-found page. Pages owned by later modules appear as intentional placeholders until those modules ship. Module id: `shell` (see CAPABILITIES.md)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate between pages (Priority: P1)

A visitor clicks a link in the header, footer, or mobile menu and arrives at a
working page — not a dead anchor or `#`. The wordmark always returns home.

**Why this priority**: Every other module ships a page behind this navigation;
until links resolve, the site is a single page with broken promises in its
header.

**Independent Test**: Click every link in header, footer, and mobile menu;
each one renders its own page and no link goes nowhere.

**Acceptance Scenarios**:

1. **Given** the visitor is on any page, **When** they click "Check PNR" in
   the header, **Then** the Check PNR page renders and the URL changes.
2. **Given** the visitor is on a sub-page, **When** they click the wordmark,
   **Then** they land on the home page.
3. **Given** the visitor is on a small screen, **When** they open the mobile
   menu and tap a link, **Then** the menu closes and the target page renders.
4. **Given** the visitor is on the home page, **When** they click an in-page
   link such as "Book Ticket", **Then** the page scrolls to that section
   without leaving home (in-page anchors remain home-only).

---

### User Story 2 - Shareable, resumable URLs (Priority: P2)

A visitor can copy the URL from the address bar, send it to someone, and the
recipient lands on exactly that page after a refresh — including unknown
paths, which resolve to a not-found page rather than a blank screen.

**Why this priority**: Deep-linking is what makes pages real; without it,
"pages" are modal states that vanish on refresh.

**Independent Test**: Paste a sub-page URL into a fresh browser tab and see
the same page render; paste a garbage URL and see not-found.

**Acceptance Scenarios**:

1. **Given** a visitor is on a sub-page, **When** they refresh the browser,
   **Then** the same page renders.
2. **Given** a valid page URL is opened in a new tab, **When** it loads,
   **Then** the page renders without first showing home.
3. **Given** an unknown URL is opened, **When** it loads, **Then** a
   not-found page renders with a clear route back home.
4. **Given** a visitor navigates between pages, **When** they press browser
   Back, **Then** the previous page renders and scrolling starts at its top.

---

### User Story 3 - Pages reserved for later modules look intentional (Priority: P3)

A visitor who reaches a page whose feature module has not shipped yet (for
example, My Bookings before its module builds it) sees a clearly labeled
placeholder that explains what will live there and offers a working next step
— never a crash, blank screen, or dead end.

**Why this priority**: Keeps the shell independently shippable while later
modules fill in real content.

**Independent Test**: Visit every reserved route before its module ships;
each shows a labeled placeholder with a working call to action.

**Acceptance Scenarios**:

1. **Given** a route's owning module has not shipped, **When** the visitor
   opens it, **Then** a placeholder page renders naming what will appear
   there, with a link back into the site.
2. **Given** a reserved route later ships real content, **When** the visitor
   opens it, **Then** the real page renders with no placeholder remnants.

---

### Edge Cases

- Refreshing on a URL with a section anchor (e.g. home plus a section) must
  still reach that section.
- A link opened in a new tab must not depend on in-app state.
- The mobile menu must close on navigation so a stale open menu never
  overlaps the next page.
- Unknown URLs must not fall through to a blank page or console error.
- Navigation while an entrance animation is mid-flight must not leave
  orphaned animation state on the next page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page in the site map MUST be reachable by its own URL and
  MUST render on direct entry without first rendering another page.
- **FR-002**: Header, footer, and mobile navigation MUST contain no dead
  links: each link resolves to either a rendered page or an in-page section
  on home.
- **FR-003**: The site MUST render a not-found page for any URL that is not
  in the site map, offering a route back home.
- **FR-004**: Browser Back and Forward MUST move between pages correctly, and
  each page load MUST begin scrolled to the top (except anchor URLs, which
  scroll to their section).
- **FR-005**: In-page anchor links (search, features, routes, FAQ) MUST keep
  working from the home page and MUST NOT be presented as separate pages.
- **FR-006**: Routes owned by not-yet-built modules MUST render a labeled
  placeholder page with a working call to action; no reserved route may 404,
  crash, or render blank.
- **FR-007**: The mobile menu MUST close after any navigation.
- **FR-008**: The page set MUST match `CAPABILITIES.md`: home, Check PNR,
  My Bookings, Sign in, Help/Contact, About, Refund policy, Privacy, Terms.

### Key Entities

- None — this module introduces no data, only navigation structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of links in header, footer, and mobile menu resolve to a
  rendered page or home anchor — zero dead links on any page.
- **SC-002**: Every site-map URL, pasted into a fresh browser tab, renders
  its own page after load and after refresh.
- **SC-003**: An unknown URL renders the not-found page with a home link —
  never a blank screen.
- **SC-004**: Browser Back returns to the previous page in one action from
  any page, with scroll reset to top.
- **SC-005**: A user can reach any page in the header or footer within two
  clicks from anywhere on the site.

## Assumptions

- The page set is exactly the one approved in `CAPABILITIES.md`; later
  modules (booking flow routes) extend the site map with their own spec.
- Placeholder pages are acceptable for routes whose modules have not shipped;
  they are labeled honestly, not faked as complete.
- In-page anchors stay on home; they do not become standalone routes.
- No authentication gate blocks any route in the shell — account-aware
  behavior belongs to the `account` and `my-bookings` modules.
