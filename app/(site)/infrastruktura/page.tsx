import type { Metadata } from "next";
import Link from "next/link";
import { PageBand } from "@/components/PageBand";
import { RoadTable } from "@/components/RoadTable";
import { SourceBadge } from "@/components/SourceBadge";
import { getInfraObjekti, getInfrastruktura } from "@/lib/data";

export const metadata: Metadata = { title: "Infrastruktura" };

export default async function InfrastrukturaPage() {
  const [infrastruktura, infraObjekti] = await Promise.all([
    getInfrastruktura(),
    getInfraObjekti(),
  ]);

  return (
    <>
      <PageBand
        kicker="03 — Stanje na terenu"
        title="Infrastruktura"
        lead="Klikni putni pravac ili objekat za sve javne podatke iz evidencije MZ i povezanih akata."
      />
      <section className="tight">
        <div className="wrap">
          <p style={{ marginBottom: 24 }}>
            <SourceBadge kind={infrastruktura.source} /> {infrastruktura.intro}
          </p>
          <RoadTable roads={infrastruktura.roads} />
          <div className="infra-icons">
            {infraObjekti.map((obj) => (
              <Link href={`/infrastruktura/${obj.slug}`} className="infra-chip" key={obj.slug}>
                {obj.chip}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
