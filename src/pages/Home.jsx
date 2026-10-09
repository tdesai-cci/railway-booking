import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  STATIONS, TRAINS, CLASSES, CLASS_ORDER, MAX_PAX,
  fare, seats, avail, hhmmTo12, crossesMidnight, inr,
  todayISO, isoAddDays,
} from "../rail.js";
import {
  riseIn, reveal, staggerParent, trainIn, railDraw, coachRun, seatFill,
  resultsPanel, tap, faqBody, chevron, EASE,
} from "../motion.js";

/* Route photos as module imports so Vite emits them into dist — root-absolute
 * /assets/*.jpg strings never leave the dev server (FR-009, SC-004). */
import routeDelhiMumbai from "../../assets/route-delhi-mumbai.jpg";
import routeMumbaiBengaluru from "../../assets/route-mumbai-bengaluru.jpg";
import routeChennaiHyderabad from "../../assets/route-chennai-hyderabad.jpg";
import routeDelhiKolkata from "../../assets/route-delhi-kolkata.jpg";

/* ============================================================
   ICONS — one stroke, one weight, drawn inline. No glyphs.
   Ico and TrainMark are shared with the shell (App.jsx).
   ============================================================ */
export const Ico = ({ d, size = 22, sw = 2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const Star = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1z" />
  </svg>
);
export const TrainMark = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ flexShrink: 0 }}>
    <rect width="100" height="100" rx="24" fill="currentColor" opacity=".14" />
    <path d="M30 24h40a7 7 0 017 7v25a7 7 0 01-7 7H30a7 7 0 01-7-7V31a7 7 0 017-7z" fill="none" stroke="currentColor" strokeWidth="6.5" />
    <path d="M23 44h54" stroke="var(--accent-500)" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M37 31h7M56 31h7" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M34 63L25 78M66 63l9 15" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
  </svg>
);

/* ============================================================
   RESULTS — the focal moment.
   Each row settles in while its rail draws itself and the coach runs it.
   ============================================================ */
function TrainRow({ t, i, cls, pax }) {
  const reduced = useReducedMotion();
  const s = seats(i, CLASS_ORDER.indexOf(cls), pax);
  const a = avail(s);
  const delay = i * 0.055;

  return (
    <motion.article className="train" {...trainIn(reduced, i)} layout={!reduced}>
      <div>
        <p className="train-name">{t.name}</p>
        <p className="train-no">Train no. {t.no}</p>
        {t.tag && <span className="badge badge-rajdhani">{t.tag}</span>}
        {t.days !== "Daily" && <span className="badge badge-days">{t.days}</span>}
      </div>

      <div className="leg">
        <span>
          <span className="leg-time">{hhmmTo12(t.dep)}</span>
          <span className="leg-code">{t.from}</span>
        </span>

        <span className="leg-line">
          <span className="leg-dur">{t.dur}{crossesMidnight(t.dep, t.arr) ? " (+1d)" : ""}</span>
          <span className="leg-rail">
            {/* The rail draws, then the coach runs it. Both originate at the
                left edge (the origin station) and finish at the right. */}
            <motion.i
              style={{
                position: "absolute", inset: 0, borderRadius: 2,
                background: "linear-gradient(90deg,var(--brand-500),var(--brand-300))",
                transformOrigin: "left",
              }}
              {...railDraw(reduced, delay + 0.1)}
            />
            <motion.i
              style={{
                position: "absolute", top: "50%", width: 8, height: 8, marginTop: -4,
                marginLeft: -4, borderRadius: "50%", background: "var(--brand-600)",
              }}
              {...coachRun(reduced, delay + 0.1)}
            />
          </span>
        </span>

        <span>
          <span className="leg-time">{hhmmTo12(t.arr)}</span>
          <span className="leg-code">{t.to}</span>
        </span>
      </div>

      <div className="avail">
        <p className={"avail-seats " + a.tone}>{a.label}</p>
        <div className="avail-bar">
          <motion.div
            className={"avail-fill" + (s > 0 && s <= 9 ? " is-low" : "")}
            style={{
              height: "100%", borderRadius: 3, transformOrigin: "left",
              background: s > 0 && s <= 9
                ? "linear-gradient(90deg,#FBBF24,var(--warn))"
                : "linear-gradient(90deg,var(--brand-500),var(--brand-700))",
            }}
            {...seatFill(reduced, Math.min(100, s * 4))}
          />
        </div>
        <p className="fare">{inr(fare(t.baseFare, cls))}<small>{cls} per seat</small></p>
        <motion.button className="btn btn-primary btn-sm" type="button" {...tap}>Book now</motion.button>
      </div>
    </motion.article>
  );
}

function Skeletons() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="skeleton" style={{ opacity: reduced ? 1 : undefined }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: reduced ? 0 : i * 0.07, duration: 0.2 }} />
      ))}
    </div>
  );
}

/* ============================================================
   SEARCH FORM
   ============================================================ */
function SearchForm() {
  const reduced = useReducedMotion();
  const [from, setFrom] = useState(STATIONS[0]);
  const [to, setTo] = useState(STATIONS[1]);
  const [date, setDate] = useState(isoAddDays(3));
  const [cls, setCls] = useState("3A");
  const [pax, setPax] = useState(1);
  const [trip, setTrip] = useState("One way");
  const [swapSpin, setSwapSpin] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = e => {
    e.preventDefault();
    clearTimeout(timer.current);
    if (from.split(" (")[0] === to.split(" (")[0]) {
      setStatus("error");
      setError("Pick two different stations to see trains between them.");
      return;
    }
    setError("");
    setStatus("loading");
    // ponytail: stands in for the availability API. Swap for the real call.
    timer.current = setTimeout(() => setStatus("done"), reduced ? 60 : 720);
  };

  const swap = () => {
    setFrom(to); setTo(from); setSwapSpin(n => n + 1);
  };

  return (
    <motion.form
      className="search" id="search-form" aria-label="Search trains"
      onSubmit={submit} {...riseIn(reduced, 0.42)} layout={!reduced}
    >
      <div className="search-tabs" role="tablist" aria-label="Booking type">
        {["One way", "Round trip", "Multi-city"].map(t => (
          <button key={t} type="button" role="tab" className="tab" aria-selected={trip === t}
                  onClick={() => setTrip(t)}>{t}</button>
        ))}
      </div>

      <div className="route">
        <div className="field">
          <label htmlFor="from">From</label>
          <select className="ctl" id="from" value={from} onChange={e => setFrom(e.target.value)}>
            {STATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <motion.button type="button" className="swap" id="swap"
          aria-label="Swap origin and destination stations"
          onClick={swap}
          animate={{ rotate: swapSpin % 2 ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
          whileTap={{ scale: 0.92 }}
        >
          <Ico d={["M16 3l4 4-4 4", "M20 7H4", "M8 21l-4-4 4-4", "M4 17h16"]} size={20} sw={2.4} />
        </motion.button>

        <div className="field">
          <label htmlFor="to">To</label>
          <select className="ctl" id="to" value={to} onChange={e => setTo(e.target.value)}>
            {STATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="date">Travel date</label>
          <input className="ctl" type="date" id="date" value={date} required
                 min={todayISO()} max={isoAddDays(90)} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="class">Class</label>
          <select className="ctl" id="class" value={cls} onChange={e => setCls(e.target.value)}>
            {CLASS_ORDER.map(k => <option key={k} value={k}>{k} — {CLASSES[k].label}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="pax-lbl">Passengers</label>
          <div className="stepper">
            <motion.button type="button" id="pax-minus" aria-label="Remove a passenger"
              disabled={pax <= 1} onClick={() => setPax(p => Math.max(1, p - 1))} {...tap}>
              <Ico d="M5 12h14" size={18} sw={2.6} />
            </motion.button>
            <output id="pax" aria-labelledby="pax-lbl" aria-live="polite">{pax}</output>
            <motion.button type="button" id="pax-plus" aria-label="Add a passenger"
              disabled={pax >= MAX_PAX} onClick={() => setPax(p => Math.min(MAX_PAX, p + 1))} {...tap}>
              <Ico d="M12 5v14M5 12h14" size={18} sw={2.6} />
            </motion.button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="submit-btn" className="sr">Search</label>
          <motion.button className="btn btn-accent search-go" type="submit" id="submit-btn"
            disabled={status === "loading"} {...tap}>
            {status === "loading"
              ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                style={{ display: "inline-block" }}>◠</motion.span> Searching</>
              : <><Ico d={["M21 21l-4.35-4.35", "M11 18a7 7 0 100-14 7 7 0 000 14z"]} size={19} sw={2.4} /> Search Trains</>}
          </motion.button>
        </div>
      </div>

      <p className="search-note">
        <Ico d={["M12 8h.01M11 12h1v4h1", "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"]} size={15} />
        Tatkal quota opens at 10:00 AM and 11:00 AM for the next day.
      </p>

      {/* Results expand out of the form rather than appearing elsewhere. */}
      <AnimatePresence mode="wait">
        {status !== "idle" && (
          <motion.div className="results" id="results" aria-live="polite" {...resultsPanel(reduced)}>
            {status === "error" ? (
              <div className="empty">
                <Ico d={["M12 8v5M12 16h.01", "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"]} size={44} sw={1.6} />
                <h3>Same station, different direction?</h3>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="res-head">
                  <h3>{pax} passenger{pax > 1 ? "s" : ""} · {from.split(" (")[0]} to {to.split(" (")[0]}</h3>
                  <span className="res-meta">
                    {status === "loading" ? "Checking live availability…"
                      : `${TRAINS.length} trains · ${cls} — ${CLASSES[cls].label}`}
                  </span>
                </div>
                {status === "loading"
                  ? <Skeletons />
                  : TRAINS.map((t, i) => <TrainRow key={t.no} t={t} i={i} cls={cls} pax={pax} />)}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

/* ============================================================
   STATS
   ============================================================ */
function Stat({ value, suffix, label, run }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (!run) return;
    if (reduced) { setN(value); return; }
    let raf;
    const dur = 1200, t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run, reduced]);
  return (
    <div className="stat">
      <div className="stat-num">{(n + (run ? suffix : "")).toLocaleString("en-IN")}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

function Stats() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [run, setRun] = useState(reduced);
  useEffect(() => {
    if (reduced || !ref.current) return;
    // Any intersection starts the count. A high threshold is missed by a fast
    // fling, and the figures would sit at zero until the reader scrolled back.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setRun(true);
      io.disconnect();
    }, { threshold: 0 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduced]);

  const items = [[1247, "+", "Trains every day"], [8400, "+", "Routes across India"],
                 [42, "L+", "Passengers booked"], [99, ".2%", "On-time success rate"]];

  return (
    <section className="stats" aria-label="Service statistics">
      <div className="stat-photo" aria-hidden="true" />
      <div className="wrap">
        <motion.div className="stat-grid" ref={ref} variants={staggerParent(reduced)}
                     initial="hidden" whileInView="shown" viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}>
          {items.map(([v, suf, lbl], i) => (
            <motion.div key={lbl} variants={reveal(reduced, i)}>
              <Stat value={v} suffix={suf} label={lbl} run={run} />
            </motion.div>
          ))}
        </motion.div>
        <p className="credit">Photos: <a href="https://commons.wikimedia.org/wiki/File:Vande_Bharat_Express_around_Mumbai.jpg">Vande Bharat Express</a>, <a href="https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_Terminus_(Victoria_Terminus).jpg">Chhatrapati Shivaji Terminus</a> · Wikimedia Commons, CC BY-SA</p>
      </div>
    </section>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */
const ICONS = {
  shield: ["M12 2l8 4v6c0 5-3.4 9.2-8 10-4.6-.8-8-5-8-10V6l8-4z", "M9 12l2 2 4-4"],
  wallet: ["M20 12V8H6a2 2 0 010-4h12v4", "M4 6v12a2 2 0 002 2h14v-4", "M18 12a2 2 0 000 4h4v-4h-4z"],
  clock: ["M3 12a9 9 0 1018 0 9 9 0 00-18 0z", "M12 7v5l3 2"],
  refresh: ["M21 12a9 9 0 11-3-6.7", "M21 3v6h-6"],
  chat: "M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  bell: ["M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 01-3.4 0"],
};

const FEATURES = [
  ["shield", "Authorised IRCTC partner", "Official Fast Rail booking. Your PNR is generated on Indian Railways servers, not ours."],
  ["wallet", "Zero convenience fee", "The fare you see is the fare you pay. No hidden IRCTC surcharge, no service charge tacked on at checkout."],
  ["clock", "Instant PNR & status", "Your ticket lands in under a second. Live train running status, platform and coach position included."],
  ["refresh", "Free instant cancellation", "Cancel any ticket before chart preparation and the full amount lands back in your account. No questions."],
  ["chat", "E-ticket on WhatsApp", "Your coach, berth and departure reminder delivered to your phone — no app install, no PDF hunting."],
  ["bell", "Round-the-clock support", "A real human on chat and phone, 24×7×365. Tatkal season included. Average first response: 40 seconds."],
];

const ROUTES = [
  [routeDelhiMumbai, "Delhi → Mumbai", "New Delhi · Mumbai Central", "16h 20m", "42 trains", "1,145"],
  [routeMumbaiBengaluru, "Mumbai → Bengaluru", "Mumbai CSMT · KSR Bengaluru", "14h 35m", "28 trains", "892"],
  [routeChennaiHyderabad, "Chennai → Hyderabad", "Chennai Central · Hyderabad Deccan", "9h 45m", "31 trains", "604"],
  [routeDelhiKolkata, "Delhi → Kolkata", "New Delhi · Howrah", "17h 10m", "33 trains", "1,028"],
];

const QUOTES = [
  ["AR", "", "Ananya Rao", "Pune → Nagpur · 12956",
   "Booked a Diwali ticket from the queue outside CSMT at 11:40 PM. Got the berth number before I reached home. Genuinely didn't expect that."],
  ["IM", "o2", "Imran Merchant", "Mumbai → Surat · 12955",
   "I book six tickets a month for my parents. The WhatsApp reminder with coach and berth has replaced about fifteen texts from relatives."],
  ["SK", "o3", "Sneha Kulkarni", "Bengaluru → Chennai · 12041",
   "Cancelled a sleeper berth on the way to the airport, money back in four minutes. That's a smaller miracle than it sounds."],
];

const FAQS = [
  ["Do I need an IRCTC account to book?",
   "No. You can search, compare fares and complete a booking as a guest. An IRCTC login is only needed if you'd like your tickets saved to your account history or you want to book more than the guest quota."],
  ["What exactly is a convenience fee, and do I pay one?",
   "It's an extra charge most third-party sites add on top of the base fare. We add none. The amount you see during search is the amount that leaves your account, including GST and railway surcharge."],
  ["How do I get a Tatkal ticket?",
   "Tatkal quota opens at 10:00 AM for tomorrow's travel and at 11:00 AM for the day after, from AC 3-tier upwards. Set the date to tomorrow and refresh at 10:00 sharp — the booking window goes live here too. Sleeper quota opens separately at 10:00 AM."],
  ["When is my PNR issued?",
   "Instantly, for every confirmed ticket. You'll see the ten-digit PNR on screen and receive the e-ticket by email and WhatsApp. The same number works on any IRCTC or railway enquiry channel."],
  ["What does waitlisted mean?",
   "Your seat isn't confirmed yet — you're in the queue and we hold the fare against your PNR. If it clears, you're confirmed automatically and notified. If it doesn't, the full amount is refunded automatically. Either way you never lose money."],
  ["Can I cancel, and do I get my money back?",
   "Yes, from My Bookings. Cancel before the chart is prepared on the train's origin date and the entire amount is refunded to your original payment method, typically within 3–5 working days. After that, Indian Railways rules apply."],
];

// One shared reveal for every static section — no per-section special cases.
// amount:"some" fires the moment a single pixel crosses the viewport edge.
// A percentage threshold can be skipped by a fast fling, leaving a section
// blank until the reader scrolls back through it.
function Sec({ id, children, className = "sec", style }) {
  const reduced = useReducedMotion();
  return (
    <motion.section id={id} className={className} style={style}
      variants={staggerParent(reduced)} initial="hidden" whileInView="shown"
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}>
      {children}
    </motion.section>
  );
}
const item = (reduced, i) => reveal(reduced, i);

function SecHead({ title, sub }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className="sec-head" {...item(reduced, 0)}>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </motion.div>
  );
}

function Features() {
  const reduced = useReducedMotion();
  return (
    <Sec id="features">
      <div className="wrap">
        <SecHead title="Everything the railway counter does, without the queue."
                 sub="Built for the way Indians actually travel — Tatkal, festival season and everything in between." />
        <div className="feats">
          {FEATURES.map(([ico, title, body], i) => (
            <motion.article key={title} className="feat" {...item(reduced, i + 1)}>
              <Ico className="feat-ico" d={ICONS[ico]} size={24} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Sec>
  );
}

function RouteCards() {
  const reduced = useReducedMotion();
  return (
    <Sec id="routes" className="sec" style={{ background: "var(--surface)", borderBlock: "1px solid var(--line)" }}>
      <div className="wrap">
        <SecHead title="The routes booked most this month"
                 sub="Fares below are for a single AC Tier 3 seat on the cheapest train in the corridor." />
        <div className="routes">
          {ROUTES.map(([img, name, ends, dur, count, price], i) => (
            <motion.article key={name} className="route-card" {...item(reduced, i + 1)}
              whileHover={reduced ? {} : { y: -4 }} transition={{ duration: 0.24, ease: EASE }}>
              <div className="route-art" style={{ backgroundImage: `url(${img})` }}>
                <span className="route-code">{name}</span>
              </div>
              <div className="route-body">
                <h3 className="route-name">{name}</h3>
                <p className="route-ends">{ends}</p>
                <div className="route-facts">
                  <span><Ico d={["M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "M12 7v5l3 2"]} size={14} sw={2.2} /> {dur}</span>
                  <span><Ico d="M4 6h16M4 12h16M4 18h10" size={14} sw={2.2} /> {count}</span>
                </div>
                <a className="btn btn-ghost btn-sm" href="#search">Book from ₹{price}</a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Sec>
  );
}

function Steps() {
  const reduced = useReducedMotion();
  const steps = [
    ["01", "Search your route", "Enter origin, destination and date. See every train with live availability and the true fare for your class."],
    ["02", "Pick your seat", "Choose from an interactive coach map, see exactly where you'll sit, and lock the berth before anyone else does."],
    ["03", "Pay and travel", "UPI, cards, netbanking — all zero-fee. PNR and e-ticket arrive instantly, by email and WhatsApp."],
  ];
  return (
    <Sec id="how">
      <div className="wrap">
        <SecHead title="Three taps, then you're on your way"
                 sub="No registration needed to search. Payment only when you're actually booking." />
        <div className="steps">
          {steps.map(([n, t, b], i) => (
            <motion.div key={n} className="step" {...item(reduced, i + 1)}
              whileHover={reduced ? {} : { y: -3 }} transition={{ duration: 0.24, ease: EASE }}>
              <span className="step-num" aria-hidden="true">{n}</span>
              <h3>{t}</h3>
              <p>{b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Sec>
  );
}

function Testimonials() {
  const reduced = useReducedMotion();
  return (
    <Sec className="sec" style={{ background: "var(--surface)", borderBlock: "1px solid var(--line)" }}>
      <div className="wrap">
        <SecHead title="People who stopped queueing" />
        <div className="quotes">
          {QUOTES.map(([ini, mod, name, route, quote], i) => (
            <motion.figure key={name} className="quote" {...item(reduced, i + 1)}>
              <div className="stars" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map(k => <Star key={k} />)}
              </div>
              <blockquote><p>{quote}</p></blockquote>
              <figcaption className="who">
                <span className={"avatar " + mod} aria-hidden="true">{ini}</span>
                <span>
                  <span className="who-name">{name}</span><br />
                  <span className="who-route">{route}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </Sec>
  );
}

function Faq() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(0);
  return (
    <Sec id="faq">
      <div className="wrap">
        <SecHead title="Before you book" />
        <div className="faq">
          {FAQS.map(([q, a], i) => (
            <motion.div key={q} layout={!reduced}
              style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)",
                       marginBottom: "var(--s3)", overflow: "hidden", background: "var(--surface)",
                       borderColor: open === i ? "var(--brand-300)" : "var(--line)" }}>
              <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`}
                onClick={() => setOpen(o => o === i ? -1 : i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                         gap: "var(--s4)", padding: "var(--s5)", minHeight: 64, width: "100%",
                         textAlign: "left", fontWeight: 700, color: "var(--ink)", fontSize: "var(--fs-base)" }}>
                {q}
                <motion.span className="chev" {...chevron(open === i, reduced)}>
                  <Ico d="M6 9l6 6 6-6" size={20} sw={2.4} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div id={`faq-${i}`} key="body" {...faqBody(reduced, true)}>
                    <p style={{ padding: "0 var(--s5) var(--s5)", fontSize: "var(--fs-base)" }}>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Sec>
  );
}

function Cta() {
  const reduced = useReducedMotion();
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <motion.div className="cta" {...reveal(reduced, 0)}
          whileHover={reduced ? {} : { scale: 1.004 }} transition={{ duration: 0.5, ease: EASE }}>
          <div className="cta-in">
            <h2>Your next journey starts here.</h2>
            <p>Join 4.2 million travellers who book Indian Railways tickets without the queue. Search is free and always will be.</p>
            <div className="cta-actions">
              <a className="btn btn-white" href="#search">Search trains</a>
              <a className="btn btn-onhero" href="#routes">Browse routes</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="hero" id="search">
      <div className="wrap">
        <div className="hero-in">
          <motion.p className="kicker-pill" {...riseIn(reduced, 0.08)}>
            <span className="dot" aria-hidden="true" /> 1,247 trains running today across India
          </motion.p>
          <motion.h1 {...riseIn(reduced, 0.16)}>
            Your seat on any train,<br /><em>booked in seconds.</em>
          </motion.h1>
          <motion.p className="hero-sub" {...riseIn(reduced, 0.26)}>
            Live seat availability, instant PNR and e-tickets on WhatsApp — with zero convenience fee on every booking.
          </motion.p>

          <motion.ul className="hero-trust" {...riseIn(reduced, 0.34)}>
            {["IRCTC authorised partner", "Zero convenience fee", "Free cancellation"].map(t => (
              <li key={t}>
                <Ico d="M20 6L9 17l-5-5" size={16} sw={3} />
                {t}
              </li>
            ))}
          </motion.ul>

          <SearchForm />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME — the landing page content, mounted at route "/".
   ============================================================ */
function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <RouteCards />
      <Steps />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}

export default Home;
