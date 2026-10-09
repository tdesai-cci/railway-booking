import { Link } from "react-router-dom";

/* Catch-all for any URL outside the site map (spec FR-003). */
export default function NotFound() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head" style={{ textAlign: "center" }}>
          <h1>Page not found</h1>
          <p>That address doesn't match a page on this site.</p>
          <p style={{ marginTop: "var(--s4)" }}>
            <Link className="btn btn-accent" to="/">Back to home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
