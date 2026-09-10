import Link from "next/link";

export default function AdminOstaloPage() {
  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 12 }}>
        Ostale tabele
      </h1>
      <div className="screen-card">
        <p style={{ marginBottom: 12 }}>
          Site, demografija, infrastruktura (putevi/objekti), mapa, dijaspora i pozdravi su već u
          posebnim Postgres tabelama i napunjeni seedom.
        </p>
        <p style={{ marginBottom: 12 }}>
          Za potpuni admin CRUD tih tabela (kao historija/projekti) možemo dodati u idućem koraku.
          Trenutno: <code>npm run db:seed-editorial</code> ponovo učitava iz <code>content/*.json</code>.
        </p>
        <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
          <li>site_settings, site_stats, site_roadmap</li>
          <li>demografija_settings, demografija_age_groups, demografija_ethnicity</li>
          <li>roads, infra_objects, infrastruktura_settings</li>
          <li>mapa_settings, mapa_markers</li>
          <li>dijaspora_settings, dijaspora_countries</li>
          <li>pozdravi_settings, pozdravi_items</li>
        </ul>
      </div>
    </div>
  );
}
