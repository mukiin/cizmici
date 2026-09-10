import Link from "next/link";
import { deletePozdravItem, getPozdraviAdmin } from "@/lib/actions/editorial-extra";
import { PozdraviSettingsForm, PozdravItemForm } from "@/components/admin/EditorialExtraForms";

export default async function AdminPozdraviPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, items } = await getPozdraviAdmin();
  const editing =
    params.new || params.id
      ? params.new
        ? null
        : items.find((i) => i.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Pozdravi
      </h1>

      <PozdraviSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Poruke</h2>
      {editing !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/pozdravi">← Lista</Link>
          </p>
          <PozdravItemForm item={editing ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/pozdravi?new=1" className="btn primary">
              Novi pozdrav
            </Link>
          </p>
          <div className="screen-card">
            {items.map((i) => (
              <div
                key={i.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  <strong>{i.name}</strong> · {i.loc}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/pozdravi?id=${i.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deletePozdravItem}>
                    <input type="hidden" name="id" value={i.id} />
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
