import Link from "next/link";
import { deleteMapaMarker, getMapaAdmin } from "@/lib/actions/editorial-extra";
import { MapaMarkerForm, MapaSettingsForm } from "@/components/admin/EditorialExtraForms";

export default async function AdminMapaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, markers } = await getMapaAdmin();
  const editing =
    params.new || params.id
      ? params.new
        ? null
        : markers.find((m) => m.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Mapa
      </h1>

      <MapaSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Markeri</h2>
      {editing !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/mapa">← Lista</Link>
          </p>
          <MapaMarkerForm item={editing ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/mapa?new=1" className="btn primary">
              Novi marker
            </Link>
          </p>
          <div className="screen-card">
            {markers.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  <strong>{m.title}</strong> · {m.legend}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/mapa?id=${m.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteMapaMarker}>
                    <input type="hidden" name="id" value={m.id} />
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
