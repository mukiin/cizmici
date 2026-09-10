import Link from "next/link";
import {
  deleteInfraObject,
  deleteRoadItem,
  getInfraAdmin,
} from "@/lib/actions/editorial-extra";
import {
  InfraObjectForm,
  InfraSettingsForm,
  RoadForm,
} from "@/components/admin/EditorialExtraForms";

export default async function AdminInfrastrukturaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, roads, objects } = await getInfraAdmin();
  const editingRoad =
    params.edit === "road"
      ? params.new
        ? null
        : roads.find((r) => r.id === params.id)
      : undefined;
  const editingObj =
    params.edit === "obj"
      ? params.new
        ? null
        : objects.find((o) => o.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Infrastruktura
      </h1>

      <InfraSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Putevi</h2>
      {editingRoad !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/infrastruktura">← Lista</Link>
          </p>
          <RoadForm item={editingRoad ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/infrastruktura?edit=road&new=1" className="btn primary">
              Novi put
            </Link>
          </p>
          <div className="screen-card" style={{ marginBottom: 28 }}>
            {roads.map((r) => (
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
                    {r.code} · {r.name}
                  </strong>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/sadrzaj/infrastruktura?edit=road&id=${r.id}`}
                    className="btn ghost"
                  >
                    Uredi
                  </Link>
                  <form action={deleteRoadItem}>
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

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Objekti</h2>
      {editingObj !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/infrastruktura">← Lista</Link>
          </p>
          <InfraObjectForm item={editingObj ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/infrastruktura?edit=obj&new=1" className="btn primary">
              Novi objekat
            </Link>
          </p>
          <div className="screen-card">
            {objects.map((o) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  <strong>{o.name}</strong> · {o.chip}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/sadrzaj/infrastruktura?edit=obj&id=${o.id}`}
                    className="btn ghost"
                  >
                    Uredi
                  </Link>
                  <form action={deleteInfraObject}>
                    <input type="hidden" name="id" value={o.id} />
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
