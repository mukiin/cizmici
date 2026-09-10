import Link from "next/link";
import { EventForm } from "@/components/admin/CmsItemForms";
import { deleteEventItem, listEventsAdmin } from "@/lib/actions/editorial";

export default async function AdminDogadjajiPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const items = await listEventsAdmin();
  const editing = params.new
    ? null
    : params.id
      ? items.find((i) => i.id === params.id)
      : undefined;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin/sadrzaj">← Sadržaj</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 16 }}>
        Događaji
      </h1>
      {editing !== undefined ? (
        <>
          <p style={{ marginBottom: 12 }}>
            <Link href="/admin/sadrzaj/dogadjaji">← Lista</Link>
          </p>
          <EventForm item={editing ?? undefined} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: 16 }}>
            <Link href="/admin/sadrzaj/dogadjaji?new=1" className="btn primary">
              Novi događaj
            </Link>
          </p>
          <div className="screen-card">
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(33,29,22,0.08)",
                }}
              >
                <strong>
                  {item.day}. {item.month} — {item.title}
                </strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/admin/sadrzaj/dogadjaji?id=${item.id}`} className="btn ghost">
                    Uredi
                  </Link>
                  <form action={deleteEventItem}>
                    <input type="hidden" name="id" value={item.id} />
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
