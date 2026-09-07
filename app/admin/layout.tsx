import Link from "next/link";
import { logoutMember } from "@/lib/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        className="wrap"
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          paddingTop: 18,
          paddingBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <Link href="/admin">Pregled</Link>
        <Link href="/admin/price">Priče</Link>
        <Link href="/admin/prijave">Prijave</Link>
        <Link href="/">Javni sajt</Link>
        <form action={logoutMember} style={{ marginLeft: "auto" }}>
          <button type="submit" className="btn ghost">
            Odjavi se
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
