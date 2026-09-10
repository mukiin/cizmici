"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthForms } from "@/components/AuthForms";
import { LogoutButton } from "@/components/LogoutButton";

export function AuthPanel({
  callbackUrl = "/",
  googleEnabled = false,
}: {
  callbackUrl?: string;
  googleEnabled?: boolean;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="screen-card auth-box">
        <p style={{ color: "rgba(33,29,22,0.55)" }}>Učitavanje…</p>
      </div>
    );
  }

  if (session?.user) {
    return (
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
          <LogoutButton />
        </div>
      </div>
    );
  }

  return <AuthForms callbackUrl={callbackUrl} googleEnabled={googleEnabled} />;
}
