import Link from "next/link";
import { HistorijaForm } from "@/components/admin/HistorijaForm";

export default function NovaHistorijaPage() {
  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj/historija">← Historija</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 20 }}>
        Nova historijska stavka
      </h1>
      <HistorijaForm />
    </div>
  );
}
