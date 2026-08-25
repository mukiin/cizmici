import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { dogadjaji } from "@/lib/data";

export const metadata: Metadata = { title: "Događaji" };

export default function DogadjajiPage() {
  return (
    <>
      <PageBand
        kicker="Kalendar"
        title="Događaji"
        lead="Dan MZ je stalna stavka. Ostali termini su primjer izgleda kalendara dok se ne otvori unos."
      />
      <section className="tight">
        <div className="wrap">
          <MockNote>
            10. juli je stvarni Dan MZ. Turnir i akcija čišćenja su ilustracija rasporeda, ne potvrđeni termini.
          </MockNote>
          <div className="cal-list">
            {dogadjaji.map((e) => (
              <div className="cal-item" key={`${e.day}-${e.title}`}>
                <div className="cal-date">
                  <div className="d">{e.day}</div>
                  <div className="m">{e.month}</div>
                </div>
                <div>
                  <h3>{e.title}</h3>
                  <div className="meta">{e.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
