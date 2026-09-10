import type { Metadata } from "next";
import { PageBand } from "@/components/PageBand";
import { Timeline } from "@/components/Timeline";
import { getHistorijaAll } from "@/lib/data";

export const metadata: Metadata = { title: "Historija" };

export default async function HistorijaPage() {
  const historija = await getHistorijaAll();

  return (
    <>
      <PageBand
        kicker="01 — Hronologija"
        title="Historija i razvoj"
        lead="Kompletna hronologija iz javnih izvora. Klikni godinu ili naslov za duži opis — ovdje će stajati sve što se naknadno pronađe."
      />
      <section className="tight">
        <div className="wrap">
          <Timeline items={historija} />
        </div>
      </section>
    </>
  );
}
