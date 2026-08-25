"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { footerLinks, navLinks } from "@/lib/nav";

function isActive(pathname: string, hash: string, href: string) {
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  return pathname === href;
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  function onNavClick(
    event: { preventDefault: () => void },
    href: string,
  ) {
    setOpen(false);
    if (pathname !== "/" || !href.startsWith("/#")) return;
    event.preventDefault();
    const id = href.slice(2);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", href);
    setHash(`#${id}`);
  }

  return (
    <nav className="site-nav">
      <div className="wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="dot" />
          Čizmići
        </Link>
        <div className="navlinks">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(pathname, hash, link.href) ? "active" : undefined}
              onClick={(event) => onNavClick(event, link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/prijava" className="nav-cta">
          Prijava
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Zatvori" : "Meni"}
        </button>
      </div>
      <div id="mobile-nav" className={`nav-drawer${open ? " open" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={(event) => onNavClick(event, link.href)}>
            {link.label}
          </Link>
        ))}
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
