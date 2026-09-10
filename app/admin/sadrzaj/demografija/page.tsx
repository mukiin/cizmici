import Link from "next/link";
import {
  deleteAgeGroup,
  deleteEthnicity,
  getDemografijaAdmin,
} from "@/lib/actions/editorial-extra";
import {
  AgeGroupForm,
  DemografijaSettingsForm,
  EthnicityForm,
} from "@/components/admin/EditorialExtraForms";

export default async function AdminDemografijaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const { settings, ageGroups, ethnicity } = await getDemografijaAdmin();
  const editingAge =
    params.edit === "age"
      ? params.new
        ? null
        : ageGroups.find((g) => g.id === params.id)
      : undefined;
  const editingEth =
    params.edit === "eth"
      ? params.new
        ? null
        : ethnicity.find((e) => e.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Demografija
      </h1>

      <DemografijaSettingsForm item={settings ?? undefined} />

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Dobne grupe</h2>
      {editingAge !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/demografija">← Lista</Link>
          </p>
          <AgeGroupForm item={editingAge ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/demografija?edit=age&new=1" className="btn primary">
              Nova grupa
            </Link>
          </p>
          <div className="screen-card" style={{ marginBottom: 28 }}>
            {ageGroups.map((g) => (
              <div
                key={g.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  {g.label}: <strong>{g.value}</strong>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/sadrzaj/demografija?edit=age&id=${g.id}`}
                    className="btn ghost"
                  >
                    Uredi
                  </Link>
                  <form action={deleteAgeGroup}>
                    <input type="hidden" name="id" value={g.id} />
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

      <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>Etnička struktura</h2>
      {editingEth !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/demografija">← Lista</Link>
          </p>
          <EthnicityForm item={editingEth ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/demografija?edit=eth&new=1" className="btn primary">
              Nova stavka
            </Link>
          </p>
          <div className="screen-card">
            {ethnicity.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <span>
                  {e.label}: <strong>{e.count}</strong> ({e.pct})
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/sadrzaj/demografija?edit=eth&id=${e.id}`}
                    className="btn ghost"
                  >
                    Uredi
                  </Link>
                  <form action={deleteEthnicity}>
                    <input type="hidden" name="id" value={e.id} />
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
