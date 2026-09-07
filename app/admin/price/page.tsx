import {
  listAllStoriesAdmin,
  setStoryStatus,
} from "@/lib/actions/content";

export default async function AdminPricePage() {
  const stories = await listAllStoriesAdmin();

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 20 }}>
        Priče
      </h1>
      <div className="screen-card">
        {stories.length === 0 ? <p>Nema priča.</p> : null}
        {stories.map((story) => (
          <article
            key={story.id}
            style={{ marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid rgba(33,29,22,0.08)" }}
          >
            <h2 style={{ fontSize: "1.15rem" }}>{story.title}</h2>
            <div className="meta" style={{ marginBottom: 8 }}>
              {story.authorName} ({story.authorEmail}) · {story.status} ·{" "}
              {story.createdAt.toLocaleString("bs-BA")}
            </div>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 10 }}>{story.body}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <form action={setStoryStatus}>
                <input type="hidden" name="id" value={story.id} />
                <input type="hidden" name="status" value="published" />
                <button type="submit" className="btn primary">
                  Objavi
                </button>
              </form>
              <form action={setStoryStatus}>
                <input type="hidden" name="id" value={story.id} />
                <input type="hidden" name="status" value="pending" />
                <button type="submit" className="btn ghost">
                  Na čekanje
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
          </article>
        ))}
      </div>
    </div>
  );
}
