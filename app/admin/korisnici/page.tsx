import Link from "next/link";
import { auth } from "@/auth";
import { listUsersAdmin, setUserRole } from "@/lib/actions/users";
import { isSuperAdminEmail } from "@/lib/super-admin";

export default async function AdminKorisniciPage() {
  const session = await auth();
  const meId = session?.user?.id;
  const people = await listUsersAdmin();

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin">← Pregled</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.8rem", marginBottom: 8 }}>
        Korisnici
      </h1>
      <p style={{ marginBottom: 24, color: "rgba(33,29,22,0.65)" }}>
        Dodijeli ili ukloni admin prava. Trajni vlasnik <strong>cizmicm</strong> ne može izgubiti
        admin prava. Nakon promjene uloge, korisnik treba se ponovo prijaviti.
      </p>

      <div className="screen-card">
        {people.length === 0 ? <p>Nema korisnika.</p> : null}
        {people.map((u) => {
          const locked = isSuperAdminEmail(u.email);
          return (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid rgba(33,29,22,0.08)",
              }}
            >
              <div>
                <strong>{u.name}</strong>
                {u.id === meId ? " (ti)" : ""}
                {locked ? " · vlasnik" : ""}
                <div className="meta">
                  {u.email} · {u.role} · {u.createdAt.toLocaleDateString("bs-BA")}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {locked ? (
                  <span className="meta">Zaštićen nalog</span>
                ) : u.role !== "admin" ? (
                  <form action={setUserRole}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="role" value="admin" />
                    <button type="submit" className="btn primary">
                      Učini adminom
                    </button>
                  </form>
                ) : u.id !== meId ? (
                  <form action={setUserRole}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="role" value="member" />
                    <button type="submit" className="btn ghost">
                      Ukloni admin
                    </button>
                  </form>
                ) : (
                  <span className="meta">Tvoj nalog</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
