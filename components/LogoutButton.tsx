"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  className = "btn ghost",
  label = "Odjavi se",
  redirectTo = "/",
}: {
  className?: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await signOut({ redirect: false });
      router.refresh();
      router.push(redirectTo);
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className={className} onClick={onLogout} disabled={pending}>
      {pending ? "Odjava…" : label}
    </button>
  );
}
