import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { IssueSubmitForm } from "@/components/IssueSubmitForm";
import { PageBand } from "@/components/PageBand";
import { listPublicIssues } from "@/lib/actions/content";

export const metadata: Metadata = { title: "Prijave" };

const statusLabel: Record<string, string> = {
  new: "Prijavljeno",
  progress: "U obradi",
  done: "Riješeno",
};

export default async function PrijavePage() {
  const session = await auth();
  const items = await listPublicIssues();

  return (
    <>
      <PageBand
        kicker="Komunalno"
        title="Prijava problema"
        lead="Prijave ulaze odmah s statusom „novo“. Administrator mijenja status i može sakriti spam."
      />
      <section className="tight">
        <div className="wrap">
          <div className="grid-2">
            {session?.user ? (
              <IssueSubmitForm />
            ) : (
              <div className="screen-card">
                <p>
                  Za slanje prijave <Link href="/prijava?callbackUrl=/prijave">prijavite se</Link>.
                </p>
              </div>
            )}
            <div className="screen-card">
              {items.length === 0 ? (
                <p>Još nema javnih prijava.</p>
              ) : (
                items.map((item) => (
                  <div className="issue-row" key={item.id}>
                    <div className="issue-thumb" />
                    <div style={{ flex: 1 }}>
                      <h4>{item.title}</h4>
                      <div className="meta">
                        {item.authorName} · {item.createdAt.toLocaleDateString("bs-BA")} ·{" "}
                        {statusLabel[item.status] ?? item.status}
                      </div>
                      <p style={{ marginTop: 6, fontSize: "0.9rem" }}>{item.body}</p>
                    </div>
                    <span className={`chip status-${item.status}`}>
                      {statusLabel[item.status] ?? item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
