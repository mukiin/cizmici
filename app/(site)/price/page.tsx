import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PageBand } from "@/components/PageBand";
import { StorySubmitForm } from "@/components/StorySubmitForm";
import { listPublishedStories } from "@/lib/actions/content";

export const metadata: Metadata = { title: "Priče" };

export default async function PricePage() {
  const session = await auth();
  const stories = await listPublishedStories();

  return (
    <>
      <PageBand
        kicker="Priče i ljudi"
        title="Priče Čizmića"
        lead="Prilozi mještana. Nove priče prolaze odobrenje administratora prije javnog prikaza."
      />
      <section className="tight">
        <div className="wrap">
          {session?.user ? (
            <StorySubmitForm />
          ) : (
            <p style={{ marginBottom: 24 }}>
              Da pošaljete priču, <Link href="/prijava">prijavite se</Link> ili kreirajte nalog.
            </p>
          )}

          {stories.length === 0 ? (
            <p>Još nema objavljenih priča. Budite prvi.</p>
          ) : (
            <div className="story-grid">
              {stories.map((s) => (
                <Link className="story-card" key={s.id} href={`/price/${s.slug}`}>
                  <div>
                    <h3>{s.title}</h3>
                    <p>
                      {s.body.slice(0, 160)}
                      {s.body.length > 160 ? "…" : ""}
                    </p>
                    <div className="meta" style={{ marginTop: 10 }}>
                      {s.authorName}
                      {s.publishedAt ? ` · ${s.publishedAt.toLocaleDateString("bs-BA")}` : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
