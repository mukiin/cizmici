import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Stranica nije pronađena" };

export default function NotFound() {
  return (
    <section>
      <div className="wrap" style={{ padding: "80px 28px" }}>
        <div className="eyebrow">404</div>
        <h1 className="title" style={{ fontSize: "3rem" }}>Nema te stranice</h1>
        <p className="lead" style={{ color: "rgba(33,29,22,0.65)", margin: "16px 0 28px", maxWidth: 480 }}>
          Možda je link star, ili je to nešto što još nismo gradili (porodična stabla, oglasi, admin).
        </p>
        <Link href="/" className="btn primary" style={{ textDecoration: "none" }}>
          Nazad na početnu
        </Link>
      </div>
    </section>
  );
}
