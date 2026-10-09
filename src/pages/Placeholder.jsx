import { Link } from "react-router-dom";

/* Shared labeled placeholder for routes whose owning module has not shipped
   yet (spec FR-006): names what will live here, offers a working next step.
   Never blank, never a crash. */
export default function Placeholder({ title, blurb, cta }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <span className="badge badge-days">Coming soon</span>
          <h1>{title}</h1>
          <p>{blurb || `${title} is being built. It will live on this page.`}</p>
          <p style={{ marginTop: "var(--s4)" }}>
            <Link className="btn btn-accent" to={(cta && cta.to) || "/"}>
              {(cta && cta.label) || "Back to home"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
