import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { staggerParent, reveal, tap, EASE } from "./motion.js";
import { routes } from "./routes.jsx";
import { TrainMark } from "./pages/Home.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./styles.css";

/* ============================================================
   HEADER
   ============================================================ */
function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 24);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const links = [["Book Ticket", "#search"], ["Why Us", "#features"], ["Routes", "#routes"], ["Help", "#faq"]];

  return (
    <motion.header
      className={"hdr" + (solid ? " is-solid" : "")}
      initial={false}
      animate={{ y: 0 }}
    >
      <div className="wrap hdr-in">
        <a className="brand" href="#main" aria-label="Railway Booking home">
          <TrainMark />
          <span>
            <span className="brand-name">Railway</span>
            <span className="brand-sub">Booking</span>
          </span>
        </a>

        <nav className="nav" aria-label="Main">
          {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
          <div className="nav-cta">
            <a className="btn btn-onhero btn-sm" href="#faq">Check PNR</a>
            <a className="btn btn-accent btn-sm" href="#search">Sign in</a>
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
            {[...links, ["Check PNR", "#faq"]].map(([t, h]) => <a key={h + t} href={h}>{t}</a>)}
            <a className="btn btn-accent" href="#search">Sign in</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const reduced = useReducedMotion();
  const cols = [
    ["Book", ["One way", "Round trip", "Multi-city", "Tatkal", "Popular routes"]],
    ["Support", ["FAQ", "Refund policy", "Contact us", "Check PNR"]],
    ["Company", ["About us", "Careers", "Press", "Partners"]],
  ];
  return (
    <footer className="ftr">
      <div className="wrap">
        <motion.div className="ftr-grid" variants={staggerParent(reduced)}
                     initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
          <motion.div className="ftr-col" {...reveal(reduced, 0)}>
            <a className="brand" href="#main" aria-label="Railway Booking home">
              <TrainMark />
              <span>
                <span className="brand-name">Railway</span>
                <span className="brand-sub">Booking</span>
              </span>
            </a>
            <p>An authorised Fast Rail partner. Ticketing services are provided subject to the rules of Indian Railways and IRCTC.</p>
          </motion.div>
          {cols.map(([title, links], i) => (
            <motion.div key={title} className="ftr-col" {...reveal(reduced, i + 1)}>
              <h3>{title}</h3>
              <ul>{links.map(l => <li key={l}><a href={l === "FAQ" ? "#faq" : "#search"}>{l}</a></li>)}</ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="ftr-bot">
          <span>© 2026 Railway Booking. All rights reserved.</span>
          <ul>{["Privacy", "Terms", "Cookies"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
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
