import Link from "next/link";

const sections = [
  { href: "/admin/sadrzaj/historija", title: "Historija", body: "Tabela historija_items" },
  { href: "/admin/sadrzaj/projekti", title: "Projekti", body: "Tabela projects" },
  { href: "/admin/sadrzaj/biznisi", title: "Biznisi", body: "Tabela businesses" },
  { href: "/admin/sadrzaj/dogadjaji", title: "Događaji", body: "Tabela events" },
  {
    href: "/admin/sadrzaj/ostalo",
    title: "Ostalo (seed)",
    body: "Site, demografija, infra, mapa, dijaspora, pozdravi — u tabelama; izmjene za sada seed/skripta",
  },
] as const;

export default function AdminSadrzajPage() {
  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 8 }}>
        Sadržaj lične karte
      </h1>
      <p style={{ marginBottom: 24, color: "rgba(33,29,22,0.65)" }}>
        Podaci su u Postgres tabelama (jedan red = jedna stavka), ne u JSON blobu.
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
