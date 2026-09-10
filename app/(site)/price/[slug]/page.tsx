import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBand } from "@/components/PageBand";
import { getPublishedStory } from "@/lib/actions/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedStory(slug);
  return { title: story?.title ?? "Priča" };
}

export default async function PriceDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getPublishedStory(slug);
  if (!story) notFound();

  return (
    <>
      <PageBand
        kicker="Priča"
        title={story.title}
        lead={`${story.authorName}${
          story.publishedAt ? ` · ${story.publishedAt.toLocaleDateString("bs-BA")}` : ""
        }`}
      />
      <section className="tight">
        <div className="wrap narrow">
          <div className="screen-card">
            {story.body.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} style={{ marginBottom: 14, lineHeight: 1.65 }}>
                  {para}
                </p>
              ) : null,
            )}
          </div>
          <p style={{ marginTop: 18 }}>
            <Link href="/price">← Sve priče</Link>
          </p>
        </div>
      </section>
    </>
  );
}
