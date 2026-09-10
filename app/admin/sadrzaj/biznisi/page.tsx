import Link from "next/link";
import { BusinessForm } from "@/components/admin/CmsItemForms";
import { deleteBusinessItem, listBusinessesAdmin } from "@/lib/actions/editorial";

export default async function AdminBiznisiPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const items = await listBusinessesAdmin();
  const editing = params.new
    ? null
    : params.id
      ? items.find((i) => i.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Biznisi
      </h1>
      {editing !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/biznisi">← Lista</Link>
          </p>
          <BusinessForm item={editing ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 16 }}>
            <Link href="/admin/sadrzaj/biznisi?new=1" className="btn primary">
              Novi biznis
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
                <strong>{item.name}</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/biznisi?id=${item.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteBusinessItem}>
                    <input type="hidden" name="id" value={item.id} />
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
