import Link from "next/link";
import {
  deleteDijasporaCountry,
  getDijasporaAdmin,
} from "@/lib/actions/editorial-extra";
import {
  DijasporaCountryForm,
  DijasporaSettingsForm,
} from "@/components/admin/EditorialExtraForms";

export default async function AdminDijasporaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, countries } = await getDijasporaAdmin();
  const editing =
    params.new || params.id
      ? params.new
        ? null
        : countries.find((c) => c.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Dijaspora
      </h1>

      <DijasporaSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Države</h2>
      {editing !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/dijaspora">← Lista</Link>
          </p>
          <DijasporaCountryForm item={editing ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/dijaspora?new=1" className="btn primary">
              Nova država
            </Link>
          </p>
          <div className="screen-card">
            {countries.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  {c.flag} <strong>{c.name}</strong> · {c.count}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/dijaspora?id=${c.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteDijasporaCountry}>
                    <input type="hidden" name="id" value={c.id} />
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
