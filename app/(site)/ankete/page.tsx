import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { anketa } from "@/lib/data";

export const metadata: Metadata = { title: "Ankete" };

export default function AnketePage() {
  return (
    <>
      <PageBand
        kicker="Pitanje zajednici"
        title="Ankete"
        lead="Jedno pitanje, vidljiv rezultat. Glasanje nije uključeno dok ne bude naloga i zaštite od duplih glasova."
      />
      <section className="tight alt">
        <div className="wrap">
          <MockNote>
            Rezultati su ilustracija izgleda, nisu pravo glasanje. Kad krene, anketa će biti jasno označena kao neslužbena.
          </MockNote>
          <div className="screen-card" style={{ maxWidth: 640 }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: 16 }}>{anketa.question}</h2>
            {anketa.options.map((opt) => (
              <div className="poll-option" key={opt.label}>
                <div className="poll-track">
                  <div className="poll-fill" style={{ width: `${opt.pct}%` }}>
                    <span>{opt.label}</span>
                  </div>
                </div>
                <div className="poll-pct">{opt.pct}%</div>
              </div>
            ))}
            <p style={{ fontSize: "0.76rem", color: "rgba(33,29,22,0.5)", marginTop: 10 }}>
              {anketa.votesLabel}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
