import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageBand } from "@/components/PageBand";
import { SourceBadge } from "@/components/SourceBadge";
import {
  getInfraObjekt,
  getPut,
  infraObjekti,
  infrastruktura,
  putNeighbors,
  putevi,
} from "@/lib/data";
import type { InfraObject, Road } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    ...putevi.map((item) => ({ slug: item.slug })),
    ...infraObjekti.map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const road = getPut(slug);
  const obj = getInfraObjekt(slug);
  const item = road ?? obj;
  if (!item) return { title: "Infrastruktura" };
  return { title: item.name };
}

function leadFor(item: Road | InfraObject) {
  if ("km" in item) {
    return item.from === item.to ? `${item.km} · ${item.from}` : `${item.from} → ${item.to} · ${item.km}`;
  }
  return item.kind === "object" ? "Javni objekat mjesne zajednice" : "Komunalna infrastruktura MZ Čizmići";
}

export default async function InfraDetaljPage({ params }: Props) {
  const { slug } = await params;
  const road = getPut(slug);
  const obj = getInfraObjekt(slug);
  const item: Road | InfraObject | undefined = road ?? obj;
  if (!item) notFound();

  const neighbors = road ? putNeighbors(road.slug) : { prev: undefined, next: undefined };

  return (
    <>
      <PageBand
        kicker={road ? `${road.id} — ${road.km}` : "Infrastruktura"}
        title={item.name}
        lead={leadFor(item)}
      />
      <section className="tight">
        <div className="wrap">
          <p style={{ marginBottom: 16 }}>
            <SourceBadge kind={infrastruktura.source} />
          </p>

          <h2 className="article-h">Podaci</h2>
          <table className="road-table" style={{ marginBottom: 32 }}>
            <tbody>
              {item.facts.map((f) => (
                <tr key={f.label}>
                  <td style={{ width: "40%" }}>{f.label}</td>
                  <td style={{ textAlign: "left", fontFamily: "inherit" }}>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="article">
            {item.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {road ? (
            <div className="article-nav">
              {neighbors.prev ? (
                <Link href={`/infrastruktura/${neighbors.prev.slug}`}>
                  ← {neighbors.prev.id} · {neighbors.prev.name}
                </Link>
              ) : (
                <span />
              )}
              {neighbors.next ? (
                <Link href={`/infrastruktura/${neighbors.next.slug}`}>
                  {neighbors.next.id} · {neighbors.next.name} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          ) : null}

          <p className="article-back">
            <Link href="/infrastruktura">Sva infrastruktura</Link>
            {" · "}
            <Link href="/#infrastruktura">Nazad na početnu</Link>
          </p>
        </div>
      </section>
    </>
  );
}
