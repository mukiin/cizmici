import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { AuthForms } from "@/components/AuthForms";
import { PageBand } from "@/components/PageBand";
import { logoutMember } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Prijava" };

export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  return (
    <>
      <PageBand
        kicker="Nalog"
        title="Prijava"
        lead="Registracija i prijava emailom. Google prijava dolazi u kasnijoj fazi."
      />
      <section className="tight">
        <div className="wrap">
          {session?.user ? (
            <div className="screen-card auth-box">
              <h2 style={{ fontSize: "1.3rem", marginBottom: 8 }}>Prijavljeni ste</h2>
              <p style={{ marginBottom: 16 }}>
                {session.user.name} · {session.user.email}
                {session.user.role === "admin" ? " · administrator" : ""}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {session.user.role === "admin" ? (
                  <Link href="/admin" className="btn primary">
                    Admin panel
                  </Link>
                ) : null}
                <Link href="/price" className="btn ghost">
                  Priče
                </Link>
                <form action={logoutMember}>
                  <button type="submit" className="btn ghost">
                    Odjavi se
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <AuthForms callbackUrl={callbackUrl} />
          )}
        </div>
      </section>
    </>
  );
}
