import Link from "next/link";
import { deleteHistorijaItem, listHistorijaAdmin } from "@/lib/actions/editorial";

export default async function AdminHistorijaListPage() {
  const items = await listHistorijaAdmin();

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Historija
      </h1>
      <p style={{ marginBottom: 16 }}>
        <Link href="/admin/sadrzaj/historija/nova" className="btn primary">
          Nova stavka
        </Link>
      </p>
      <div className="screen-card">
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid rgba(33,29,22,0.08)",
            }}
          >
            <div>
              <strong>
                {item.year} — {item.title}
              </strong>
              <div className="meta">
                {item.slug}
                {item.featured ? " · featured" : ""}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/admin/sadrzaj/historija/${item.slug}`} className="btn ghost">
                Uredi
              </Link>
              <form action={deleteHistorijaItem}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="btn ghost">
                  Obriši
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
