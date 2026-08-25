import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageBand } from "@/components/PageBand";
import { SourceBadge } from "@/components/SourceBadge";
import { getHistorija, historija, historijaNeighbors } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return historija.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getHistorija(slug);
  if (!item) return { title: "Historija" };
  return { title: `${item.year} · ${item.title}` };
}

export default async function HistorijaClanakPage({ params }: Props) {
  const { slug } = await params;
  const item = getHistorija(slug);
  if (!item) notFound();

  const { prev, next } = historijaNeighbors(item.slug);

  return (
    <>
      <PageBand kicker={`${item.year} · historija`} title={item.title} lead={item.body} />
      <section className="tight">
        <div className="wrap article">
          <p style={{ marginBottom: 28 }}>
            <SourceBadge kind={item.source} />
          </p>
          {item.detail.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="article-nav">
            {prev ? (
              <Link href={`/historija/${prev.slug}`}>
                ← {prev.year} · {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/historija/${next.slug}`}>
                {next.year} · {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
          <p className="article-back">
            <Link href="/historija">Sva historija</Link>
            {" · "}
            <Link href="/#historija">Nazad na početnu</Link>
          </p>
        </div>
      </section>
    </>
  );
}
