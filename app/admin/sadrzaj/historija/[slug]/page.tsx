import Link from "next/link";
import { notFound } from "next/navigation";
import { HistorijaForm } from "@/components/admin/HistorijaForm";
import { getHistorijaAdmin } from "@/lib/actions/editorial";

type Props = { params: Promise<{ slug: string }> };

export default async function EditHistorijaPage({ params }: Props) {
  const { slug } = await params;
  const item = await getHistorijaAdmin(slug);
  if (!item) notFound();

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj/historija">← Historija</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 20 }}>
        Uredi: {item.title}
      </h1>
      <HistorijaForm item={item} />
    </div>
  );
}
