import type { Metadata } from "next";
import { AgeBars } from "@/components/AgeBars";
import { PageBand } from "@/components/PageBand";
import { SourceBadge } from "@/components/SourceBadge";
import { demografija } from "@/lib/data";

export const metadata: Metadata = { title: "Stanovništvo" };

export default function StanovnistvoPage() {
  return (
    <>
      <PageBand
        kicker="02 — Popis 2013."
        title="Stanovništvo"
        lead={demografija.note}
      />
      <section className="tight alt">
        <div className="wrap">
          <p style={{ marginBottom: 28, fontSize: "0.9rem", color: "rgba(33,29,22,0.62)" }}>
            <SourceBadge kind={demografija.source} label={demografija.sourceLabel} />
          </p>
          <div className="demo-grid">
            <div className="demo-panel">
              <h3>Starosna struktura (odabrane skupine)</h3>
              <AgeBars groups={demografija.ageGroups} />
              <div className="bignum-row">
                <div className="bignum">
                  <div className="n">{demografija.males}</div>
                  <div className="l">muškaraca</div>
                </div>
                <div className="bignum">
                  <div className="n">{demografija.females}</div>
                  <div className="l">žena</div>
                </div>
                <div className="bignum">
                  <div className="n">{demografija.areaKm2} km²</div>
                  <div className="l">površina naselja</div>
                </div>
              </div>
            </div>
            <div className="demo-panel">
              <h3>Etnička struktura</h3>
              <table className="eth-table">
                <tbody>
                  {demografija.ethnicity.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>
                        {row.count} · {row.pct}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ fontWeight: 600 }}>Ukupno</td>
                    <td style={{ fontWeight: 600 }}>{demografija.total}</td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{ marginTop: 32 }}>Napomena o obuhvatu</h3>
              <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.6)" }}>
                {demografija.coverageNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
