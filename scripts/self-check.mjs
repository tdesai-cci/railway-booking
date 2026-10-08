// Run with: npm run check
// Exits non-zero on the first failed rule so CI can gate on it.
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

if (!process.exitCode) console.log(`SELF-CHECK PASSED — ${checks} assertions`);
