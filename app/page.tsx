import type { Metadata } from "next";
import Link from "next/link";
import { AgeBars } from "@/components/AgeBars";
import { HeroContours } from "@/components/HeroContours";
import { LiveStrip } from "@/components/LiveStrip";
import { LocalMapLoader } from "@/components/LocalMapLoader";
import { SourceBadge } from "@/components/SourceBadge";
import { Timeline } from "@/components/Timeline";
import { RoadTable } from "@/components/RoadTable";
import {
  biznisi,
  demografija,
  historijaPregled,
  infrastruktura,
  mapa,
  price,
  projekti,
  infraObjekti,
  site,
} from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "Čizmići — Lična karta mjesne zajednice" },
};

export default function HomePage() {
  const stories = price.slice(0, 3);

  return (
    <>
      <LiveStrip />
      <header className="hero">
        <HeroContours />
        <div className="wrap hero-inner">
          <div className="eyebrow">
            MZ Čizmići · {site.location.municipality} · {site.location.canton}
          </div>
          <h1 className="title">Čizmići</h1>
          <p className="lead">{site.tagline} Sastavljeno iz javno dostupnih zvaničnih izvora.</p>
          <div className="coord-badge">
            {site.location.lat}° N, {site.location.lng}° E ·{" "}
            <span>{site.location.elevationM} m</span> nadmorske visine · {site.location.note}
          </div>
          <div className="statgrid">
            {site.stats.map((s) => (
              <div className="statcell" key={s.label}>
                <div className="num">{s.value}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section id="historija">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">01 — Hronologija</span>
              <h2>Historija i razvoj</h2>
            </div>
            <div className="sub">
              Odabrani datumi. Klikni godinu za duži opis — kompletna hronologija je na posebnoj
              stranici.
            </div>
          </div>
          <Timeline items={historijaPregled} />
          <p className="section-more">
            <Link href="/historija">Cijela historija Čizmića →</Link>
          </p>
        </div>
      </section>

      <section id="stanovnistvo" className="alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">02 — Popis 2013.</span>
              <h2>Stanovništvo</h2>
            </div>
            <div className="sub">
              {demografija.note}{" "}
              <SourceBadge kind={demografija.source} label={demografija.sourceLabel} />
            </div>
          </div>
          <div className="demo-grid">
            <div className="demo-panel">
              <h3>Starosna struktura (odabrane skupine)</h3>
              <AgeBars groups={demografija.ageGroups} />
              <div className="bignum-row">
                <div className="bignum">
                  <div className="n">{demografija.males}</div>
                  <div className="l">muškaraca</div>
                </div>
                <div className="bignum">
                  <div className="n">{demografija.females}</div>
                  <div className="l">žena</div>
                </div>
                <div className="bignum">
                  <div className="n">{demografija.areaKm2} km²</div>
                  <div className="l">površina naselja</div>
                </div>
              </div>
            </div>
            <div className="demo-panel">
              <h3>Etnička struktura</h3>
              <table className="eth-table">
                <tbody>
                  {demografija.ethnicity.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>
                        {row.count} · {row.pct}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ fontWeight: 600 }}>Ukupno</td>
                    <td style={{ fontWeight: 600 }}>{demografija.total}</td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{ marginTop: 32 }}>Napomena o obuhvatu</h3>
              <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.6)" }}>
                {demografija.coverageNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="infrastruktura">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">03 — Stanje na terenu</span>
              <h2>Infrastruktura</h2>
            </div>
            <div className="sub">
              {infrastruktura.intro} <SourceBadge kind={infrastruktura.source} />
            </div>
          </div>
          <RoadTable roads={infrastruktura.roads} />
          <div className="infra-icons">
            {infraObjekti.map((obj) => (
              <Link href={`/infrastruktura/${obj.slug}`} className="infra-chip" key={obj.slug}>
                {obj.chip}
              </Link>
            ))}
          </div>
          <p className="section-more">
            <Link href="/infrastruktura">Sva infrastruktura →</Link>
          </p>
        </div>
      </section>

      <section id="mapa" className="alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">04 — Teren</span>
              <h2>Mapa Čizmića</h2>
            </div>
            <div className="sub">{mapa.intro}</div>
          </div>
          <LocalMapLoader data={mapa} />
          <div className="map-legend">
            {mapa.markers.map((m) => (
              <span key={m.legend}>
                <i style={{ background: m.color }} />
                {m.legend}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="projekti">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">05 — Transparentnost</span>
              <h2>Projekti u zajednici</h2>
            </div>
            <div className="sub">Investicije Grada Cazina i zajednice u MZ Čizmići, po dostupnim aktima.</div>
          </div>
          <div className="proj-grid">
            {projekti.map((p) => (
              <div className="proj-card" key={p.title}>
                <span className={`status ${p.status}`}>{p.statusLabel}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <div className="meta">
                  <span>{p.year}</span>
                  <span>{p.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="biznisi" className="alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">06 — Privreda</span>
              <h2>Naši biznisi</h2>
            </div>
            <div className="sub">
              Javno registrovana privredna društva i obrti sa adresom u Čizmićima.{" "}
              <SourceBadge kind="public" label="poslovni registar" />
            </div>
          </div>
          <div className="biz-grid">
            {biznisi.map((b) => (
              <div className="biz-card" key={b.name}>
                <span className="tag">{b.tag}</span>
                <h3>{b.name}</h3>
                <p>{b.body}</p>
                <div className="founded">{b.founded}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="price">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">07 — Uskoro</span>
              <h2>Priče i ljudi Čizmića</h2>
            </div>
            <div className="sub">
              Ova sekcija se otvara u Fazi 2, kada mještani dobiju mogućnost prijave i objavljivanja.
            </div>
          </div>
          <div className="story-grid">
            {stories.map((s) => (
              <div className="story-card" key={s.title}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                {s.soon ? <span className="soon">Faza 2</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="o" className="alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="idx">08 — Plan razvoja</span>
              <h2>O platformi</h2>
            </div>
            <div className="sub">
              Čizmići.ba se gradi u fazama — svaka faza je samostalno korisna prije nego se pređe na
              sljedeću.
            </div>
          </div>
          {site.roadmap.map((phase) => (
            <div className={`phase-row${phase.live ? "" : " inactive"}`} key={phase.num}>
              <div className="p-num">{phase.num}</div>
              <div className="p-body">
                <h3>
                  {phase.title}
                  {phase.live ? <span className="p-live">● trenutna verzija</span> : null}
                </h3>
                <p>{phase.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
