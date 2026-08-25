import Link from "next/link";
import { site } from "@/lib/data";
import { footerLinks } from "@/lib/nav";
import { SourceBadge } from "./SourceBadge";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <h4>{site.name}</h4>
            <p>{site.disclaimer}</p>
          </div>
          <div>
            <h4>Izvori</h4>
            <ul>
              {site.sources.map((src) => (
                <li key={src}>{src}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Stranice</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 16 }}>
              <SourceBadge kind="official" />
              <span style={{ marginLeft: 8 }}>
                <SourceBadge kind="verified" />
              </span>
              <span style={{ marginLeft: 8 }}>
                <SourceBadge kind="public" />
              </span>
            </p>
          </div>
        </div>
        <div className="fine">
          Prototip Faze 1 · nije zvanična stranica MZ Čizmići ni Grada Cazina · podaci se
          ažuriraju uz doprinos zajednice
        </div>
      </div>
    </footer>
  );
}
