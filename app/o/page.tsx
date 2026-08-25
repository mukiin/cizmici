import type { Metadata } from "next";
import { PageBand } from "@/components/PageBand";
import { SourceBadge } from "@/components/SourceBadge";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "O platformi" };

export default function OPage() {
  return (
    <>
      <PageBand
        kicker="08 — Plan razvoja"
        title="O platformi"
        lead="Čizmići.ba se gradi u fazama — svaka faza je samostalno korisna prije nego se pređe na sljedeću. Ovo nije zvanična stranica MZ ni Grada Cazina."
      />
      <section className="tight alt">
        <div className="wrap">
          {site.roadmap.map((phase) => (
            <div className={`phase-row${phase.live ? "" : " inactive"}`} key={phase.num}>
              <div className="p-num">{phase.num}</div>
              <div className="p-body">
                <h3>
                  {phase.title}
                  {phase.live ? <span className="p-live">● trenutna verzija</span> : null}
                </h3>
                <p>{phase.body}</p>
              </div>
            </div>
          ))}

          <div className="section-head" style={{ marginTop: 56, marginBottom: 20 }}>
            <div>
              <span className="idx">Izvori</span>
              <h2>Odakle su podaci</h2>
            </div>
          </div>
          <ul style={{ listStyle: "none", marginBottom: 28 }}>
            {site.sources.map((s) => (
              <li key={s} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                {s}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: "0.9rem", color: "rgba(33,29,22,0.65)", marginBottom: 16 }}>
            {site.disclaimer}
          </p>
          <p>
            <SourceBadge kind="official" /> <SourceBadge kind="verified" />{" "}
            <SourceBadge kind="public" />
          </p>
        </div>
      </section>
    </>
  );
}
