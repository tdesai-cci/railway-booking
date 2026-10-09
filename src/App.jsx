import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { staggerParent, reveal, tap, EASE } from "./motion.js";
import { routes } from "./routes.jsx";
import { TrainMark } from "./pages/Home.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./styles.css";

/* ============================================================
   HEADER
   ============================================================ */
/* In-page home anchors: chrome copy, ids validated against homeAnchors by
   `npm run check`. Native fragment links — correct on home (spec FR-005);
   cross-page anchor navigation lands in US2. */
const HEADER_ANCHORS = [["Book Ticket", "search"], ["Why Us", "features"], ["Routes", "routes"]];

function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 24);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Sub-pages have no hero behind the header: keep it solid so ink stays
  // legible (constitution III).
  const isSolid = solid || pathname !== "/";
  const pageLinks = routes.filter(r => r.nav?.includes("header") && !r.btn);
  const ctas = routes.filter(r => r.nav?.includes("header") && r.btn);

  return (
    <motion.header
      className={"hdr" + (isSolid ? " is-solid" : "")}
      initial={false}
      animate={{ y: 0 }}
    >
      <div className="wrap hdr-in">
        <Link className="brand" to="/" aria-label="Railway Booking home">
          <TrainMark />
          <span>
            <span className="brand-name">Railway</span>
            <span className="brand-sub">Booking</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {HEADER_ANCHORS.map(([t, id]) => <a key={id} href={`#${id}`}>{t}</a>)}
          {pageLinks.map(r => <Link key={r.path} to={r.path}>{r.label}</Link>)}
          <div className="nav-cta">
            {ctas.map(r => (
              <Link key={r.path} className={`btn btn-${r.btn} btn-sm`} to={r.path}>{r.label}</Link>
            ))}
          </div>
        </nav>

        <motion.button
          className="burger" id="burger" type="button"
          aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(o => !o)} {...tap}
        >
          {/* Two plain paths cross-fade and rotate. Framer cannot interpolate
              between multi-sub-path `d` strings, so it renders nothing. */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <motion.path d="M4 7h16M4 12h16M4 17h16"
              animate={{ opacity: open ? 0 : 1, rotate: open ? 90 : 0 }}
              transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
              style={{ originX: "50%", originY: "50%" }} />
            <motion.path d="M6 6l12 12M18 6L6 18"
              animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -90 }}
              transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
              style={{ originX: "50%", originY: "50%" }} />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav wrap" id="mobile-nav" aria-label="Mobile"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.34, ease: EASE }}
            onClick={e => { if (e.target.closest("a")) setOpen(false); }}
          >
            {[
              ...HEADER_ANCHORS.map(([t, id]) => ({ t, href: `#${id}` })),
              ...pageLinks.map(r => ({ t: r.label, to: r.path })),
              ...ctas.map(r => ({ t: r.label, to: r.path, btn: r.btn })),
            ].map(it => it.to
              ? <Link key={it.to} className={it.btn ? `btn btn-${it.btn}` : undefined} to={it.to}>{it.t}</Link>
              : <a key={it.href} href={it.href}>{it.t}</a>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
/* Internal link: native fragment anchors (home-only, FR-005) vs router pages. */
const FLink = ({ to, children }) =>
  to.startsWith("#") ? <a href={to}>{children}</a> : <Link to={to}>{children}</Link>;

/* Page columns derive from the route table; only anchor targets are local
   chrome copy (validated against homeAnchors by `npm run check`). */
const footerCols = () => {
  const pages = g => routes.filter(r => r.nav?.includes("footer") && r.footerGroup === g)
    .map(r => [r.label, r.path]);
  return [
    ["Book", [["One way", "#search"], ["Round trip", "#search"], ["Multi-city", "#search"],
              ["Tatkal", "#search"], ["Popular routes", "#routes"]]],
    ["Support", [["FAQ", "#faq"], ...pages("Support")]],
    ["Company", pages("Company")],
  ];
};

function Footer() {
  const reduced = useReducedMotion();
  const cols = footerCols();
  const legal = routes.filter(r => ["/privacy", "/terms"].includes(r.path));
  return (
    <footer className="ftr">
      <div className="wrap">
        <motion.div className="ftr-grid" variants={staggerParent(reduced)}
                     initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
          <motion.div className="ftr-col" {...reveal(reduced, 0)}>
            <Link className="brand" to="/" aria-label="Railway Booking home">
              <TrainMark />
              <span>
                <span className="brand-name">Railway</span>
                <span className="brand-sub">Booking</span>
              </span>
            </Link>
            <p>An authorised Fast Rail partner. Ticketing services are provided subject to the rules of Indian Railways and IRCTC.</p>
          </motion.div>
          {cols.map(([title, links], i) => (
            <motion.div key={title} className="ftr-col" {...reveal(reduced, i + 1)}>
              <h3>{title}</h3>
              <ul>{links.map(([t, to]) => <li key={t + to}><FLink to={to}>{t}</FLink></li>)}</ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="ftr-bot">
          <span>© 2026 Railway Booking. All rights reserved.</span>
          <ul>{legal.map(r => <li key={r.path}><Link to={r.path}>{r.label}</Link></li>)}</ul>
        </div>

        <p className="credit">Photos: <a href="https://commons.wikimedia.org/wiki/File:Vande_Bharat_Express_around_Mumbai.jpg">Vande Bharat Express</a>, <a href="https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_Terminus_(Victoria_Terminus).jpg">CSMT</a>, <a href="https://commons.wikimedia.org/wiki/File:Trivandrum_Rajdhani_Express_at_Trivandrum_Central_Station.jpg">Rajdhani</a>, <a href="https://commons.wikimedia.org/wiki/File:Gateway_of_India_-_HDR.jpg">Gateway of India</a>, <a href="https://commons.wikimedia.org/wiki/File:The_Charminar_on_a_cloudy_day.jpg">Charminar</a>, <a href="https://commons.wikimedia.org/wiki/File:India_Gate,_New_Delhi.jpg">India Gate</a>, <a href="https://commons.wikimedia.org/wiki/File:Dibrugarh_Rajdhani_Express_at_Dibrugarh_Railway_Station.jpg">Dibrugarh</a> — Wikimedia Commons, CC BY-SA</p>
      </div>
    </footer>
  );
}

/* ============================================================
   APP — the shell: router + chrome. Pages render into <main>.
   ============================================================ */
function App() {
  return (
    <BrowserRouter>
      <a className="skip" href="#main">Skip to main content</a>
      <Header />
      <main id="main">
        <Routes>
          {routes.map(r => (
            <Route key={r.path} path={r.path}
              element={r.page
                ? <r.page />
                : <Placeholder title={r.label} blurb={r.placeholder.blurb} cta={r.placeholder.cta} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
