// Run with: npm run check
// Exits non-zero on the first failed rule so CI can gate on it.
import { readFileSync } from "node:fs";
import {
  TRAINS, CLASSES, CLASS_ORDER, fare, seats, avail,
  hhmmTo12, crossesMidnight, esc, inr, MAX_PAX,
} from "../src/rail.js";

let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    console.error("FAIL: " + msg);
    process.exitCode = 1;
  }
};

// 1. Fare must increase strictly with class, cheapest class first.
const cheapestFirst = [...CLASS_ORDER].reverse();
for (let i = 1; i < cheapestFirst.length; i++)
  ok(fare(1000, cheapestFirst[i]) > fare(1000, cheapestFirst[i - 1]),
     `fare not monotonic at ${cheapestFirst[i]}`);

// 2. Fare is always a clean multiple of 10.
for (const k of Object.keys(CLASSES))
  ok(fare(1237, k) % 10 === 0, `fare not rounded to ₹10 for ${k}`);

// 3. Seats stay within 0..24 and 0 maps to waitlist.
for (let t = 0; t < TRAINS.length; t++)
  for (let c = 0; c < CLASS_ORDER.length; c++) {
    const s = seats(t, c, 1);
    ok(s >= 0 && s <= 24, `seats out of range: ${s}`);
    ok(avail(s).label === "Waitlist only" ? s === 0 : s > 0, "waitlist mapping wrong");
  }

// 4. Overnight leg detection.
ok(crossesMidnight("23:00", "06:00") === true,  "23:00→06:00 should cross midnight");
ok(crossesMidnight("06:00", "18:00") === false, "06:00→18:00 should not cross midnight");

// 5. 12-hour formatting.
ok(hhmmTo12("00:05") === "12:05 AM", "midnight format wrong");
ok(hhmmTo12("12:30") === "12:30 PM", "noon format wrong");
ok(hhmmTo12("23:59") === "11:59 PM", "late format wrong");

// 6. Escaping neutralises markup and entities.
ok(esc('<img src=x onerror="alert(1)">') === "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
   "esc() does not neutralise markup");
ok(esc("O'Brien & Sons") === "O&#39;Brien &amp; Sons", "esc() mishandles apostrophe/ampersand");

// 7. Indian digit grouping, and the passenger ceiling is enforced upstream.
ok(inr(1245) === "₹1,245", "inr() grouping wrong");
ok(inr(8400) === "₹8,400", "inr() grouping wrong for 4 digits");
ok(MAX_PAX === 6, "passenger ceiling changed without updating the stepper");

// 8. Route table integrity (specs/001-shell/contracts/route-table.md).
const routesSrc = readFileSync(new URL("../src/routes.jsx", import.meta.url), "utf8");
const appSrc = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const homeSrc = readFileSync(new URL("../src/pages/Home.jsx", import.meta.url), "utf8");
const capsSrc = readFileSync(new URL("../CAPABILITIES.md", import.meta.url), "utf8");

const paths = [...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map(m => m[1]);
ok(paths.length >= 9, `route table has ${paths.length} rows, expected >= 9`);
ok(new Set(paths).size === paths.length, "duplicate path in route table");
ok(paths.every(p => p.startsWith("/") && (p === "/" || !p.endsWith("/"))),
   "paths must start with / and carry no trailing slash");

// Every row: page XOR placeholder, owner must be a CAPABILITIES module id.
const capIds = new Set([...capsSrc.matchAll(/^\|\s*`([a-z-]+)`\s*\|/gm)].map(m => m[1]));
routesSrc.split(/{\s*path:/).slice(1).forEach((row, i) => {
  const hasPage = /page:\s*[A-Z]/.test(row);
  const hasPh = /placeholder:/.test(row);
  ok(hasPage !== hasPh, `route row ${i}: needs page XOR placeholder`);
  const owner = row.match(/owner:\s*"([^"]+)"/);
  ok(!!owner, `route row ${i}: missing owner`);
  if (owner) ok(capIds.has(owner[1]), `owner "${owner[1]}" not in CAPABILITIES.md`);
});

// homeAnchors must point at real section ids in Home.jsx.
const anchorList = routesSrc.match(/homeAnchors = \[([^\]]+)\]/);
ok(!!anchorList, "routes.jsx must export homeAnchors");
const anchors = anchorList
  ? [...anchorList[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : [];
anchors.forEach(id =>
  ok(homeSrc.includes(`id="${id}"`), `homeAnchor "${id}" has no element id in Home.jsx`));

// Placeholder CTA targets must resolve like any other link (FR-006).
[...routesSrc.matchAll(/to:\s*"([^"]+)"/g)].map(m => m[1]).forEach(t => {
  const [p, hash] = t.split("#");
  ok(paths.includes(p), `routes.jsx cta to unknown path ${t}`);
  if (hash) ok(anchors.includes(hash), `routes.jsx cta to unknown anchor #${hash}`);
});

// Every literal link target in App.jsx resolves: paths against the table,
// fragments against homeAnchors (skip link may target #main).
[...appSrc.matchAll(/["'](\/[^"']*|#[^"']*)["']/g)].map(m => m[1]).filter(t => t.length > 1).forEach(t => {
  if (t.startsWith("#")) {
    ok(t === "#main" || anchors.includes(t.slice(1)), `App links to unknown anchor ${t}`);
  } else {
    const [p, hash] = t.split("#");
    ok(paths.includes(p), `App links to unknown path ${t}`);
    if (hash) ok(anchors.includes(hash), `App links to unknown anchor #${hash}`);
  }
});

// Header anchors and home-page fragment links must also be valid.
const ha = appSrc.match(/HEADER_ANCHORS = \[([\s\S]*?)\]/);
ok(!!ha, "App.jsx must define HEADER_ANCHORS");
if (ha) [...ha[1].matchAll(/"([^"]+)"/g)].map(m => m[1]).filter((_, i) => i % 2 === 1)
  .forEach(id => ok(anchors.includes(id), `header anchor "${id}" not in homeAnchors`));
[...homeSrc.matchAll(/href="(#[^"]+)"/g)].map(m => m[1]).forEach(t =>
  ok(anchors.includes(t.slice(1)), `Home.jsx links to unknown anchor ${t}`));

if (!process.exitCode) console.log(`SELF-CHECK PASSED — ${checks} assertions`);
