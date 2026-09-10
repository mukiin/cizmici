import Link from "next/link";
import {
  deleteSiteRoadmap,
  deleteSiteStat,
  getSiteAdmin,
} from "@/lib/actions/editorial-extra";
import {
  SiteRoadmapForm,
  SiteSettingsForm,
  SiteStatForm,
} from "@/components/admin/EditorialExtraForms";

export default async function AdminSitePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, stats, roadmap } = await getSiteAdmin();
  const section = params.edit; // stat | roadmap | undefined
  const editingStat =
    section === "stat"
      ? params.new
        ? null
        : stats.find((s) => s.id === params.id)
      : undefined;
  const editingRoadmap =
    section === "roadmap"
      ? params.new
        ? null
        : roadmap.find((r) => r.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Site
      </h1>

      <SiteSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Statistike</h2>
      {editingStat !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/site">← Lista</Link>
          </p>
          <SiteStatForm item={editingStat ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/site?edit=stat&new=1" className="btn primary">
              Nova statistika
            </Link>
          </p>
          <div className="screen-card" style={{ marginBottom: 28 }}>
            {stats.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  <strong>{s.value}</strong> — {s.label}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/site?edit=stat&id=${s.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteSiteStat}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className="btn ghost">
                      Obriši
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Roadmap</h2>
      {editingRoadmap !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/site">← Lista</Link>
          </p>
          <SiteRoadmapForm item={editingRoadmap ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/site?edit=roadmap&new=1" className="btn primary">
              Nova stavka
            </Link>
          </p>
          <div className="screen-card">
            {roadmap.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  <strong>
                    {r.num}. {r.title}
                  </strong>
                  {r.live ? " · uživo" : ""}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/site?edit=roadmap&id=${r.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteSiteRoadmap}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="btn ghost">
                      Obriši
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
