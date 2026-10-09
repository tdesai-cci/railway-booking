import Home from "./pages/Home.jsx";
import Placeholder from "./pages/Placeholder.jsx";

/* In-page section ids on the home page (spec FR-005) — never routes.
   Every id here must exist as an element id in pages/Home.jsx
   (asserted by `npm run check`). */
export const homeAnchors = ["search", "features", "routes", "how", "faq"];

/* Single source of truth for every page: the router and the nav surfaces
   all read this table (contracts/route-table.md).
   - nav: which surfaces auto-render this page as a link
   - btn: header CTA styling ("onhero" | "accent"), header/mobile only
   - footerGroup: footer column for nav:"footer" rows
   - placeholder: stays until the owning module replaces it with a real `page`
     (data-model invariant 3: page XOR placeholder) */
export const routes = [
  { path: "/", label: "Home", owner: "shell", page: Home },
  { path: "/check-pnr", label: "Check PNR", nav: ["header", "mobile", "footer"],
    btn: "onhero", footerGroup: "Support", owner: "pnr-lookup", placeholder: {} },
  { path: "/my-bookings", label: "My Bookings", nav: ["footer"],
    footerGroup: "Support", owner: "my-bookings", placeholder: {} },
  { path: "/sign-in", label: "Sign in", nav: ["header", "mobile"],
    btn: "accent", owner: "account", placeholder: {} },
  { path: "/help", label: "Help & contact", nav: ["header", "mobile", "footer"],
    footerGroup: "Support", owner: "info-pages", placeholder: {} },
  { path: "/about", label: "About us", nav: ["footer"],
    footerGroup: "Company", owner: "info-pages", placeholder: {} },
  { path: "/refund-policy", label: "Refund policy", nav: ["footer"],
    footerGroup: "Support", owner: "info-pages", placeholder: {} },
  { path: "/privacy", label: "Privacy", nav: ["footer"],
    footerGroup: "Company", owner: "info-pages", placeholder: {} },
  { path: "/terms", label: "Terms", nav: ["footer"],
    footerGroup: "Company", owner: "info-pages", placeholder: {} },
];
