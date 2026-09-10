import Link from "next/link";

const sections = [
  { href: "/admin/sadrzaj/historija", title: "Historija", body: "historija_items" },
  { href: "/admin/sadrzaj/projekti", title: "Projekti", body: "projects" },
  { href: "/admin/sadrzaj/biznisi", title: "Biznisi", body: "businesses" },
  { href: "/admin/sadrzaj/dogadjaji", title: "Događaji", body: "events" },
  { href: "/admin/sadrzaj/site", title: "Site", body: "site_settings, stats, roadmap" },
  { href: "/admin/sadrzaj/demografija", title: "Demografija", body: "settings, age, ethnicity" },
  {
    href: "/admin/sadrzaj/infrastruktura",
    title: "Infrastruktura",
    body: "putevi, objekti, intro",
  },
  { href: "/admin/sadrzaj/mapa", title: "Mapa", body: "settings + markeri" },
  { href: "/admin/sadrzaj/dijaspora", title: "Dijaspora", body: "settings + države" },
  { href: "/admin/sadrzaj/pozdravi", title: "Pozdravi", body: "settings + poruke" },
] as const;

export default function AdminSadrzajPage() {
  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 8 }}>
        Sadržaj lične karte
      </h1>
      <p style={{ marginBottom: 24, color: "rgba(33,29,22,0.65)" }}>
        Sve sekcije se uređuju u Postgres tabelama — bez JSON bloba.
      </p>
      <div className="screen-card">
        {sections.map((s) => (
          <div
            key={s.href}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid rgba(33,29,22,0.08)",
            }}
          >
            <div>
              <strong>{s.title}</strong>
              <div className="meta">{s.body}</div>
            </div>
            <Link href={s.href} className="btn ghost">
              Otvori
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
