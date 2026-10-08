// Motion vocabulary.
//
// Thesis: this is a Persuade surface whose centre of gravity is a deadline.
// The one authored moment is the search resolving into real trains — the rail
// draws itself origin→destination and the coach runs it, because that is the
// only place in the product where something is genuinely being fetched under
// pressure. Everything else is feedback: taps, tab changes, the swap rotation,
// the accordion, and a shared-element morph from the form into the results.
//
// Budget: only transform, opacity and clip. No layout-animating properties,
// no filters on scroll, no loop that runs offscreen.

export const EASE = [0.16, 1, 0.3, 1]; // confident arrival, no overshoot
export const EASE_OUT = [0.4, 0, 0.2, 1];

// Focal entrance: authored, so it gets the long tail.
export const riseIn = (reduced, delay = 0) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.15 : 0.62, delay: reduced ? 0 : delay, ease: EASE },
});

// Section reveal on scroll — one shared variant, driven per-item by stagger.
export const reveal = (reduced, i = 0) => ({
  variants: {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 26 },
    shown: { opacity: 1, y: 0 },
  },
  transition: { duration: reduced ? 0.15 : 0.55, delay: reduced ? 0 : Math.min(i, 6) * 0.07, ease: EASE },
});

// Sibling list: a wave, capped so nothing arrives late enough to feel broken.
export const staggerParent = (reduced) => ({
  hidden: {},
  shown: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.04 } },
});

// Per-result entrance. The rail-draw is the story; the row itself just settles.
export const trainIn = (reduced, i) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : i * 0.055, ease: EASE },
});

// The rail draws left→right with scaleX, then the coach dot travels it.
export const railDraw = (reduced, delay = 0) => ({
  initial: reduced ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 },
  animate: reduced ? { opacity: 1, scaleX: 1 } : { opacity: 1, scaleX: 1 },
  transition: { duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: EASE },
});

export const coachRun = (reduced, delay = 0) => ({
  initial: reduced ? { opacity: 1, left: "100%" } : { opacity: 0, left: "0%" },
  animate: { opacity: 1, left: "100%" },
  transition: { duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: EASE },
});

// Availability bar fills from the origin side — it reads as "seats arriving".
export const seatFill = (reduced, pct) => ({
  initial: reduced ? { width: `${pct}%` } : { width: "0%" },
  animate: { width: `${pct}%` },
  transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : 0.34, ease: EASE },
});

// Shared element: the form is the origin of the results, so the results panel
// expands out of it rather than appearing somewhere else on the page.
export const resultsPanel = (reduced) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: -10, scaleY: 0.96 },
  animate: { opacity: 1, y: 0, scaleY: 1 },
  exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
  transition: { duration: reduced ? 0.15 : 0.4, ease: EASE },
});

// Tap feedback: scale only, so it never costs layout.
export const tap = { whileTap: { scale: 0.97 }, transition: { duration: 0.12 } };

// Accordion body height, animated by the browser rather than by layout props.
export const faqBody = (reduced, open) => ({
  initial: { height: reduced ? "auto" : 0, opacity: reduced ? 1 : 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: reduced ? "auto" : 0, opacity: 0 },
  transition: { duration: reduced ? 0.1 : 0.32, ease: EASE_OUT },
});

export const chevron = (open, reduced) => ({
  animate: { rotate: open ? 180 : 0 },
  transition: { duration: reduced ? 0 : 0.28, ease: EASE_OUT },
});
