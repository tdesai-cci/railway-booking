// Fare and availability rules. Pure, no DOM, no React — so `npm run check`
// can exercise every branch without a browser.

export const STATIONS = [
  "New Delhi (NDLS)", "Mumbai Central (MMCT)", "Chennai Central (MAS)",
  "KSR Bengaluru (SBC)", "Hyderabad Deccan (HYB)", "Howrah Kolkata (HWH)",
  "Jaipur (JP)", "Pune Junction (PUNE)", "Ahmedabad (ADI)", "Vadodara (BRC)"
];

// baseFare = cheapest AC Tier 3 fare for the corridor, in rupees.
export const TRAINS = [
  { no:"12951", name:"Mumbai Rajdhani",    from:"New Delhi",      to:"Mumbai Central",  dep:"16:20", arr:"08:40", dur:"16h 20m", days:"Daily",  baseFare:1245, tag:"Rajdhani" },
  { no:"12009", name:"Shatabdi Express",   from:"Mumbai Central", to:"Ahmedabad",      dep:"06:20", arr:"18:35", dur:"12h 15m", days:"Daily",  baseFare: 945 },
  { no:"12621", name:"Tamil Nadu Express", from:"Chennai Central",to:"Mumbai Central",  dep:"21:15", arr:"14:30", dur:"17h 15m", days:"Daily",  baseFare:1025 },
  { no:"12841", name:"Coromandel Express", from:"Howrah Kolkata", to:"Chennai Central", dep:"23:00", arr:"10:55", dur:"11h 55m", days:"Daily",  baseFare: 812 },
  { no:"12723", name:"Telangana Express",  from:"Hyderabad Deccan",to:"New Delhi",     dep:"19:05", arr:"11:40", dur:"16h 35m", days:"Mon, Wed, Fri", baseFare:1088 },
  { no:"22209", name:"Duronto Express",    from:"New Delhi",      to:"Pune Junction",   dep:"21:30", arr:"15:20", dur:"17h 50m", days:"Tue, Fri, Sun", baseFare:1402 }
];

export const CLASSES = {
  "1A": { label:"AC First Class",   mult:3.2 },
  "2A": { label:"AC Tier 2",        mult:1.9 },
  "3A": { label:"AC Tier 3",        mult:1.35 },
  "SL": { label:"Sleeper (Non-AC)", mult:0.75 },
  "GN": { label:"General",          mult:0.45 }
};

export const CLASS_ORDER = ["1A", "2A", "3A", "SL", "GN"];
export const MAX_PAX = 6;

// Fare rises with class and always rounds to a clean ₹10 increment.
export const fare = (base, cls) => Math.round((base * CLASSES[cls].mult) / 10) * 10;

// Deterministic pseudo-availability so results stay stable across renders.
export const seats = (trainIdx, classIdx, pax) =>
  ((trainIdx * 7 + classIdx * 13 + pax * 3) % 9) * 3; // 0..24, 0 means waitlist

export const avail = s => s === 0
  ? { label:"Waitlist only",  tone:"avail-wl" }
  : s <= 9
    ? { label:`Only ${s} left`, tone:"avail-low" }
    : { label:`${s} seats available`, tone:"avail-ok" };

const clock = hhmm => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

export const hhmmTo12 = hhmm => {
  const [h, m] = hhmm.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${p}`;
};

// Arrival earlier than departure means the train crosses midnight.
export const crossesMidnight = (dep, arr) => clock(arr) <= clock(dep);

export const inr = n => "₹" + n.toLocaleString("en-IN");

// Anything reaching rendered text goes through this. The data is local today,
// but a future API response must not be able to inject markup.
export const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const todayISO = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
};

export const isoAddDays = n => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).toISOString().slice(0, 10);
};
