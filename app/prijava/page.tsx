import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";

export const metadata: Metadata = { title: "Prijava" };

export default function PrijavaPage() {
  return (
    <>
      <PageBand
        kicker="Nalog"
        title="Prijava"
        lead="Ekran je spreman. Prijava emailom ili Google nalogom dolazi u sljedećoj fazi — forme ništa ne šalju."
      />
      <section className="tight">
        <div className="wrap">
          <div className="screen-card auth-box">
            <MockNote>Registracija i prijava nisu aktivne. Možeš pregledati izgled ekrana.</MockNote>
            <h2 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Dobrodošli nazad</h2>
            <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.55)", marginBottom: 22 }}>
              Prijavite se svojim nalogom ili nastavite sa Google računom.
            </p>
            <div className="field disabled">
              <label htmlFor="email">E-mail adresa</label>
              <input id="email" type="email" placeholder="ime@email.com" disabled autoComplete="off" />
            </div>
            <div className="field disabled">
              <label htmlFor="lozinka">Lozinka</label>
              <input id="lozinka" type="password" placeholder="••••••••" disabled autoComplete="off" />
            </div>
            <button type="button" className="btn primary disabled" style={{ width: "100%", marginBottom: 10 }} disabled>
              Prijavi se
            </button>
            <button type="button" className="btn ghost disabled" style={{ width: "100%" }} disabled>
              Nastavi sa Google računom
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
