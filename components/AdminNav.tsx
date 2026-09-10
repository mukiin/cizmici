"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { logoutMember } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/sadrzaj", label: "Sadržaj" },
  { href: "/admin/price", label: "Priče" },
  { href: "/admin/prijave", label: "Prijave" },
  { href: "/", label: "Javni sajt" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    for (const link of links) {
      if (link.href !== "/") router.prefetch(link.href);
    }
  }, [router]);

  return (
    <nav className="site-nav">
      <div className="wrap">
        <Link href="/admin" className="brand" prefetch>
          <span className="dot" />
          Admin · Čizmići
        </Link>
        <div className="navlinks">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={isActive(pathname, link.href) ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <form action={logoutMember}>
          <button type="submit" className="nav-cta">
            Odjavi se
          </button>
        </form>
      </div>
    </nav>
  );
}
