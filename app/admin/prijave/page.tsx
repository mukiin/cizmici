import {
  listAllIssuesAdmin,
  setIssueStatus,
  setIssueVisibility,
} from "@/lib/actions/content";

export default async function AdminPrijavePage() {
  const issues = await listAllIssuesAdmin();

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 20 }}>
        Prijave
      </h1>
      <div className="screen-card">
        {issues.length === 0 ? <p>Nema prijava.</p> : null}
        {issues.map((issue) => (
          <article
            key={issue.id}
            style={{ marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid rgba(33,29,22,0.08)" }}
          >
            <h2 style={{ fontSize: "1.15rem" }}>{issue.title}</h2>
            <div className="meta" style={{ marginBottom: 8 }}>
              {issue.authorName} ({issue.authorEmail}) · {issue.kind} · {issue.status} ·{" "}
              {issue.visibility} · {issue.createdAt.toLocaleString("bs-BA")}
            </div>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 10 }}>{issue.body}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <form action={setIssueStatus} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="hidden" name="id" value={issue.id} />
                <label>
                  Status{" "}
                  <select name="status" defaultValue={issue.status}>
                    <option value="new">Novo</option>
                    <option value="progress">U obradi</option>
                    <option value="done">Riješeno</option>
                  </select>
                </label>
                <button type="submit" className="btn primary">
                  Spremi status
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
                  {issue.visibility === "public" ? "Sakrij" : "Prikaži javno"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
