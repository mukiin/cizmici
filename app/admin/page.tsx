import Link from "next/link";
import { getAdminOverview } from "@/lib/admin-queries";
import {
  setIssueStatus,
  setIssueVisibility,
  setStoryStatus,
} from "@/lib/actions/content";

export default async function AdminHomePage() {
  const { stories, issues } = await getAdminOverview();

  const pending = stories.filter((s) => s.status === "pending").length;
  const openIssues = issues.filter((i) => i.status !== "done").length;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p className="kicker">Administracija</p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "2rem", marginBottom: 8 }}>
        Panel
      </h1>
      <p style={{ marginBottom: 24, color: "rgba(33,29,22,0.65)" }}>
        Na čekanju: {pending} priča · Otvorene prijave: {openIssues} ·{" "}
        <Link href="/admin/sadrzaj">Uredi sadržaj →</Link> ·{" "}
        <Link href="/admin/korisnici">Korisnici →</Link>
      </p>

      <div className="grid-2">
        <section className="screen-card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: "1.2rem" }}>Priče</h2>
            <Link href="/admin/price">Sve priče →</Link>
          </div>
          {stories.slice(0, 6).map((story) => (
            <div
              key={story.id}
              style={{
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(33,29,22,0.08)",
              }}
            >
              <strong>{story.title}</strong>
              <div className="meta">
                {story.authorName} · {story.status} · {story.createdAt.toLocaleDateString("bs-BA")}
              </div>
              {story.status === "pending" ? (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <form action={setStoryStatus}>
                    <input type="hidden" name="id" value={story.id} />
                    <input type="hidden" name="status" value="published" />
                    <button type="submit" className="btn primary">
                      Odobri
                    </button>
                  </form>
                  <form action={setStoryStatus}>
                    <input type="hidden" name="id" value={story.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className="btn ghost">
                      Odbij
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <section className="screen-card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: "1.2rem" }}>Prijave</h2>
            <Link href="/admin/prijave">Sve prijave →</Link>
          </div>
          {issues.slice(0, 6).map((issue) => (
            <div
              key={issue.id}
              style={{
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(33,29,22,0.08)",
              }}
            >
              <strong>{issue.title}</strong>
              <div className="meta">
                {issue.authorName} · {issue.status} · {issue.visibility} ·{" "}
                {issue.createdAt.toLocaleDateString("bs-BA")}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <form action={setIssueStatus} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="hidden" name="id" value={issue.id} />
                  <select name="status" defaultValue={issue.status}>
                    <option value="new">Novo</option>
                    <option value="progress">U obradi</option>
                    <option value="done">Riješeno</option>
                  </select>
                  <button type="submit" className="btn primary">
                    Spremi
                  </button>
                </form>
                <form action={setIssueVisibility}>
                  <input type="hidden" name="id" value={issue.id} />
                  <input
                    type="hidden"
                    name="visibility"
                    value={issue.visibility === "public" ? "hidden" : "public"}
                  />
                  <button type="submit" className="btn ghost">
                    {issue.visibility === "public" ? "Sakrij" : "Prikaži"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
