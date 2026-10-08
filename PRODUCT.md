# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + Framer Motion, migrated from a single static `index.html`. Chosen by the user so the interface can carry authored motion rather than CSS-only transitions.

## Users

Two distinct jobs, deliberately not blended:

- **The Tatkal rush.** At 10:00 AM for tomorrow's travel, racing the quota window against other people. Needs the fastest possible path to a confirmed seat, and needs the page to feel fast and to make the deadline's urgency legible.
- **The planned traveller.** Booking days ahead for family, comparing trains, classes and fares calmly. Needs comparison, legibility and reassurance rather than speed.

Because both matter, the interface needs an obvious fast path and an obvious careful path rather than one compromise flow.

## Product Purpose

Book Indian Railways tickets. Success means a user reaches a confirmed PNR, or a waitlisted PNR that is held and auto-settled, without the railway counter queue and without a surprise fee at checkout.

## Positioning

An authorised partner that charges no convenience fee — the fare shown during search is the amount that leaves the account, GST and railway surcharge included. Fast Rail booking with the PNR generated on Indian Railways' own servers.

## Operating Context

- Tatkal quota opens 10:00 AM for tomorrow and 11:00 AM for the day after, AC 3-tier upwards; Sleeper opens separately at 10:00 AM.
- Chart preparation on the train's origin date is the hard cancellation deadline; after it, Indian Railways rules apply.
- Indian Railways conventions are load-bearing here: PNR, berth, coach position, quota classes, and the 60–120 day advance booking window by zone.
- Users are frequently on a phone, on Indian mobile data, and frequently travelling.

## Capabilities and Constraints

- Search by origin, destination, date, class and passenger count (max 6). No registration required to search; login only for account history and guest-quota limits.
- Guest booking permitted; IRCTC login required beyond guest quota.
- Instant PNR on confirmation; e-ticket by email and WhatsApp with coach, berth and departure reminder.
- Waitlist holds the fare; auto-confirms if the seat clears, auto-refunds if it does not.
- Cancellation refunds in full before chart preparation, typically 3–5 working days.
- Support is staffed 24×7×365, including Tatkal season.
- Fares must be surfaced inclusive of all mandatory charges — this is the core promise and is not negotiable in the UI.
- Zero convenience fee. Any future monetization must not reintroduce a hidden charge at checkout.

## Brand Commitments

- **Binding: Indian Railways / IRCTC brand rules.** The interface must not resemble official IRCTC or Indian Railways branding and must not use their marks, logos, or proprietary visual assets. Do not add endorsement-implying device.
- **Binding: the wordmark "Railway Booking" is fixed.** Do not rename or restyle it.
- Palette direction (night-train navy with platform saffron) and the train mark are established in code; the saffron/navy relationship is committed, individual token values are not.
- Voice: plain, specific, no hype. Names the fare, the deadline and the recovery.

## Evidence on Hand

- All on-page figures are real and sourced, confirmed by the user: 4.2 million passengers booked, 99.2% on-time success rate, 1,247 trains daily, 8,400 routes, IRCTC authorised partner status, zero convenience fee.
- The three named testimonials (Ananya Rao, Imran Merchant, Sneha Kulkarni) are real and may be cited.
- Photography is CC BY-SA from Wikimedia Commons: Vande Bharat Express, Chhatrapati Shivaji Terminus, Trivandrum Rajdhani, Gateway of India, Charminar, India Gate, Dibrugarh Rajdhani. Attribution is already rendered on-page and must survive any layout change.
- Available in `assets/`.

## Product Principles

1. **The deadline is the product.** Tatkal is the moment the brand is judged. Urgency gets design attention; calm planning gets legibility.
2. **No fee surprises, ever.** Any figure shown before checkout is the figure charged.
3. **The queue is the competitor.** Every step removed from the counter ritual is the value.
4. **Reassure at the high-stakes moments** — quota open, waitlisted, cancellation deadline — where money and disappointment are both live.
5. **One destination, two speeds.** The Tatkal user and the planned traveller are not served by the same pacing.

## Accessibility & Inclusion

WCAG 2.2 AA is the bar, not a target. All text must clear 4.5:1 (3:1 for large text) on its actual composited background, including text over photography. Every animation has a `prefers-reduced-motion` path that reduces movement while preserving state and feedback. Mobile is a first-class surface — the primary journey must work one-handed on a small screen over slow data.
