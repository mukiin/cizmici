"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import {
  saveAgeGroup,
  saveDemografijaSettings,
  saveDijasporaCountry,
  saveDijasporaSettings,
  saveEthnicity,
  saveInfraObject,
  saveInfraSettings,
  saveMapaMarker,
  saveMapaSettings,
  savePozdravItem,
  savePozdraviSettings,
  saveRoadItem,
  saveSiteRoadmap,
  saveSiteSettings,
  saveSiteStat,
} from "@/lib/actions/editorial-extra";

const initial: ActionState = { ok: false };

function Feedback({ state }: { state: ActionState }) {
  return (
    <>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.message}</p> : null}
    </>
  );
}

export function SiteSettingsForm({
  item,
}: {
  item?: {
    id?: string;
    name?: string;
    domain?: string;
    tagline?: string;
    municipality?: string;
    canton?: string;
    settlements?: string[];
    lat?: number;
    lng?: number;
    elevationM?: number;
    locationNote?: string;
    danMzMonth?: number;
    danMzDay?: number;
    foundedYear?: number;
    lastNews?: string;
    lastNewsHref?: string;
    sources?: string[];
    disclaimer?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveSiteSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Osnovne postavke</h2>
      <div className="field">
        <label htmlFor="name">Naziv</label>
        <input id="name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="domain">Domena</label>
        <input id="domain" name="domain" defaultValue={item?.domain} />
      </div>
      <div className="field">
        <label htmlFor="tagline">Tagline</label>
        <input id="tagline" name="tagline" defaultValue={item?.tagline} required />
      </div>
      <div className="field">
        <label htmlFor="municipality">Općina</label>
        <input id="municipality" name="municipality" defaultValue={item?.municipality} />
      </div>
      <div className="field">
        <label htmlFor="canton">Kanton</label>
        <input id="canton" name="canton" defaultValue={item?.canton} />
      </div>
      <div className="field">
        <label htmlFor="settlements">Naselja (jedno po liniji)</label>
        <textarea
          id="settlements"
          name="settlements"
          rows={3}
          defaultValue={item?.settlements?.join("\n")}
        />
      </div>
      <div className="field">
        <label htmlFor="lat">Lat</label>
        <input id="lat" name="lat" defaultValue={item?.lat} />
      </div>
      <div className="field">
        <label htmlFor="lng">Lng</label>
        <input id="lng" name="lng" defaultValue={item?.lng} />
      </div>
      <div className="field">
        <label htmlFor="elevationM">Nadmorska visina (m)</label>
        <input id="elevationM" name="elevationM" defaultValue={item?.elevationM} />
      </div>
      <div className="field">
        <label htmlFor="locationNote">Napomena o lokaciji</label>
        <textarea id="locationNote" name="locationNote" rows={2} defaultValue={item?.locationNote} />
      </div>
      <div className="field">
        <label htmlFor="danMzMonth">Dan MZ — mjesec</label>
        <input id="danMzMonth" name="danMzMonth" defaultValue={item?.danMzMonth} />
      </div>
      <div className="field">
        <label htmlFor="danMzDay">Dan MZ — dan</label>
        <input id="danMzDay" name="danMzDay" defaultValue={item?.danMzDay} />
      </div>
      <div className="field">
        <label htmlFor="foundedYear">Godina osnivanja</label>
        <input id="foundedYear" name="foundedYear" defaultValue={item?.foundedYear} />
      </div>
      <div className="field">
        <label htmlFor="lastNews">Zadnja vijest</label>
        <input id="lastNews" name="lastNews" defaultValue={item?.lastNews} />
      </div>
      <div className="field">
        <label htmlFor="lastNewsHref">Link vijesti</label>
        <input id="lastNewsHref" name="lastNewsHref" defaultValue={item?.lastNewsHref} />
      </div>
      <div className="field">
        <label htmlFor="sources">Izvori (jedan po liniji)</label>
        <textarea id="sources" name="sources" rows={3} defaultValue={item?.sources?.join("\n")} />
      </div>
      <div className="field">
        <label htmlFor="disclaimer">Disclaimer</label>
        <textarea id="disclaimer" name="disclaimer" rows={3} defaultValue={item?.disclaimer} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj postavke
      </button>
    </form>
  );
}

export function SiteStatForm({
  item,
}: {
  item?: { id?: string; value?: string; label?: string };
}) {
  const [state, action, pending] = useActionState(saveSiteStat, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="stat-value">Vrijednost</label>
        <input id="stat-value" name="value" defaultValue={item?.value} required />
      </div>
      <div className="field">
        <label htmlFor="stat-label">Oznaka</label>
        <input id="stat-label" name="label" defaultValue={item?.label} required />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function SiteRoadmapForm({
  item,
}: {
  item?: { id?: string; num?: string; title?: string; body?: string; live?: boolean };
}) {
  const [state, action, pending] = useActionState(saveSiteRoadmap, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="rm-num">Broj</label>
        <input id="rm-num" name="num" defaultValue={item?.num} />
      </div>
      <div className="field">
        <label htmlFor="rm-title">Naslov</label>
        <input id="rm-title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="rm-body">Tekst</label>
        <textarea id="rm-body" name="body" rows={3} defaultValue={item?.body} required />
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="live" defaultChecked={item?.live} /> Uživo
        </label>
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function DemografijaSettingsForm({
  item,
}: {
  item?: {
    id?: string;
    note?: string;
    coverageNote?: string;
    source?: string;
    sourceLabel?: string;
    males?: number;
    females?: number;
    areaKm2?: number;
    total?: number;
  };
}) {
  const [state, action, pending] = useActionState(saveDemografijaSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Demografija — postavke</h2>
      <div className="field">
        <label htmlFor="note">Napomena</label>
        <textarea id="note" name="note" rows={3} defaultValue={item?.note} required />
      </div>
      <div className="field">
        <label htmlFor="coverageNote">Pokriće</label>
        <textarea id="coverageNote" name="coverageNote" rows={2} defaultValue={item?.coverageNote} />
      </div>
      <div className="field">
        <label htmlFor="source">Izvor</label>
        <select id="source" name="source" defaultValue={item?.source ?? "official"}>
          <option value="official">Službeno</option>
          <option value="verified">Provjereno</option>
          <option value="public">Javno</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="sourceLabel">Oznaka izvora</label>
        <input id="sourceLabel" name="sourceLabel" defaultValue={item?.sourceLabel} />
      </div>
      <div className="field">
        <label htmlFor="males">Muškarci</label>
        <input id="males" name="males" defaultValue={item?.males} />
      </div>
      <div className="field">
        <label htmlFor="females">Žene</label>
        <input id="females" name="females" defaultValue={item?.females} />
      </div>
      <div className="field">
        <label htmlFor="total">Ukupno</label>
        <input id="total" name="total" defaultValue={item?.total} />
      </div>
      <div className="field">
        <label htmlFor="areaKm2">Površina km²</label>
        <input id="areaKm2" name="areaKm2" defaultValue={item?.areaKm2} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function AgeGroupForm({
  item,
}: {
  item?: { id?: string; label?: string; value?: number };
}) {
  const [state, action, pending] = useActionState(saveAgeGroup, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="ag-label">Oznaka</label>
        <input id="ag-label" name="label" defaultValue={item?.label} required />
      </div>
      <div className="field">
        <label htmlFor="ag-value">Broj</label>
        <input id="ag-value" name="value" defaultValue={item?.value} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function EthnicityForm({
  item,
}: {
  item?: { id?: string; label?: string; count?: number; pct?: string };
}) {
  const [state, action, pending] = useActionState(saveEthnicity, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="eth-label">Oznaka</label>
        <input id="eth-label" name="label" defaultValue={item?.label} required />
      </div>
      <div className="field">
        <label htmlFor="eth-count">Broj</label>
        <input id="eth-count" name="count" defaultValue={item?.count} />
      </div>
      <div className="field">
        <label htmlFor="eth-pct">Postotak</label>
        <input id="eth-pct" name="pct" defaultValue={item?.pct} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function InfraSettingsForm({
  item,
}: {
  item?: { id?: string; intro?: string; source?: string };
}) {
  const [state, action, pending] = useActionState(saveInfraSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Infrastruktura — uvod</h2>
      <div className="field">
        <label htmlFor="intro">Uvod</label>
        <textarea id="intro" name="intro" rows={3} defaultValue={item?.intro} required />
      </div>
      <div className="field">
        <label htmlFor="infra-source">Izvor</label>
        <select id="infra-source" name="source" defaultValue={item?.source ?? "official"}>
          <option value="official">Službeno</option>
          <option value="verified">Provjereno</option>
          <option value="public">Javno</option>
        </select>
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

function factsToText(facts?: { label: string; value: string }[]) {
  return (facts ?? []).map((f) => `${f.label}|${f.value}`).join("\n");
}

export function RoadForm({
  item,
}: {
  item?: {
    id?: string;
    code?: string;
    slug?: string;
    name?: string;
    km?: string;
    fromPlace?: string;
    toPlace?: string;
    detail?: string[];
    facts?: { label: string; value: string }[];
  };
}) {
  const [state, action, pending] = useActionState(saveRoadItem, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="code">Šifra</label>
        <input id="code" name="code" defaultValue={item?.code} required />
      </div>
      <div className="field">
        <label htmlFor="road-name">Naziv</label>
        <input id="road-name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="road-slug">Slug</label>
        <input id="road-slug" name="slug" defaultValue={item?.slug} />
      </div>
      <div className="field">
        <label htmlFor="km">Kilometri</label>
        <input id="km" name="km" defaultValue={item?.km} />
      </div>
      <div className="field">
        <label htmlFor="fromPlace">Od</label>
        <input id="fromPlace" name="fromPlace" defaultValue={item?.fromPlace} />
      </div>
      <div className="field">
        <label htmlFor="toPlace">Do</label>
        <input id="toPlace" name="toPlace" defaultValue={item?.toPlace} />
      </div>
      <div className="field">
        <label htmlFor="road-detail">Detalj (pasus po liniji)</label>
        <textarea
          id="road-detail"
          name="detail"
          rows={4}
          defaultValue={item?.detail?.join("\n")}
        />
      </div>
      <div className="field">
        <label htmlFor="road-facts">Činjenice (oznaka|vrijednost po liniji)</label>
        <textarea id="road-facts" name="facts" rows={4} defaultValue={factsToText(item?.facts)} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj put
      </button>
    </form>
  );
}

export function InfraObjectForm({
  item,
}: {
  item?: {
    id?: string;
    slug?: string;
    name?: string;
    chip?: string;
    kind?: string;
    detail?: string[];
    facts?: { label: string; value: string }[];
  };
}) {
  const [state, action, pending] = useActionState(saveInfraObject, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="obj-name">Naziv</label>
        <input id="obj-name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="obj-slug">Slug</label>
        <input id="obj-slug" name="slug" defaultValue={item?.slug} />
      </div>
      <div className="field">
        <label htmlFor="chip">Chip</label>
        <input id="chip" name="chip" defaultValue={item?.chip} required />
      </div>
      <div className="field">
        <label htmlFor="kind">Vrsta</label>
        <select id="kind" name="kind" defaultValue={item?.kind ?? "object"}>
          <option value="object">Objekat</option>
          <option value="network">Mreža</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="obj-detail">Detalj (pasus po liniji)</label>
        <textarea id="obj-detail" name="detail" rows={4} defaultValue={item?.detail?.join("\n")} />
      </div>
      <div className="field">
        <label htmlFor="obj-facts">Činjenice (oznaka|vrijednost)</label>
        <textarea id="obj-facts" name="facts" rows={4} defaultValue={factsToText(item?.facts)} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj objekat
      </button>
    </form>
  );
}

export function MapaSettingsForm({
  item,
}: {
  item?: {
    id?: string;
    intro?: string | null;
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
    path?: [number, number][] | null;
  };
}) {
  const [state, action, pending] = useActionState(saveMapaSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Mapa — postavke</h2>
      <div className="field">
        <label htmlFor="mapa-intro">Uvod</label>
        <textarea id="mapa-intro" name="intro" rows={2} defaultValue={item?.intro ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="centerLat">Centar lat</label>
        <input id="centerLat" name="centerLat" defaultValue={item?.centerLat} />
      </div>
      <div className="field">
        <label htmlFor="centerLng">Centar lng</label>
        <input id="centerLng" name="centerLng" defaultValue={item?.centerLng} />
      </div>
      <div className="field">
        <label htmlFor="zoom">Zoom</label>
        <input id="zoom" name="zoom" defaultValue={item?.zoom} />
      </div>
      <div className="field">
        <label htmlFor="path">Putanja (JSON niz ili lat,lng po liniji)</label>
        <textarea
          id="path"
          name="path"
          rows={4}
          defaultValue={item?.path ? JSON.stringify(item.path) : ""}
        />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function MapaMarkerForm({
  item,
}: {
  item?: {
    id?: string;
    lat?: number;
    lng?: number;
    color?: string;
    title?: string;
    body?: string;
    legend?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveMapaMarker, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="mk-title">Naslov</label>
        <input id="mk-title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="mk-body">Tekst</label>
        <textarea id="mk-body" name="body" rows={2} defaultValue={item?.body} />
      </div>
      <div className="field">
        <label htmlFor="mk-legend">Legenda</label>
        <input id="mk-legend" name="legend" defaultValue={item?.legend} />
      </div>
      <div className="field">
        <label htmlFor="mk-color">Boja</label>
        <input id="mk-color" name="color" defaultValue={item?.color ?? "#a6502e"} />
      </div>
      <div className="field">
        <label htmlFor="mk-lat">Lat</label>
        <input id="mk-lat" name="lat" defaultValue={item?.lat} />
      </div>
      <div className="field">
        <label htmlFor="mk-lng">Lng</label>
        <input id="mk-lng" name="lng" defaultValue={item?.lng} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj marker
      </button>
    </form>
  );
}

export function DijasporaSettingsForm({
  item,
}: {
  item?: {
    id?: string;
    illustrative?: boolean;
    note?: string;
    total?: number;
    countriesCount?: number;
    homeLat?: number;
    homeLng?: number;
    homeName?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveDijasporaSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Dijaspora — postavke</h2>
      <div className="field">
        <label htmlFor="dj-note">Napomena</label>
        <textarea id="dj-note" name="note" rows={3} defaultValue={item?.note} required />
      </div>
      <div className="field">
        <label htmlFor="dj-total">Ukupno</label>
        <input id="dj-total" name="total" defaultValue={item?.total} />
      </div>
      <div className="field">
        <label htmlFor="dj-cc">Broj zemalja</label>
        <input id="dj-cc" name="countriesCount" defaultValue={item?.countriesCount} />
      </div>
      <div className="field">
        <label htmlFor="homeName">Dom — naziv</label>
        <input id="homeName" name="homeName" defaultValue={item?.homeName} />
      </div>
      <div className="field">
        <label htmlFor="homeLat">Dom lat</label>
        <input id="homeLat" name="homeLat" defaultValue={item?.homeLat} />
      </div>
      <div className="field">
        <label htmlFor="homeLng">Dom lng</label>
        <input id="homeLng" name="homeLng" defaultValue={item?.homeLng} />
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="illustrative" defaultChecked={item?.illustrative ?? true} />{" "}
          Ilustrativno
        </label>
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function DijasporaCountryForm({
  item,
}: {
  item?: {
    id?: string;
    flag?: string;
    name?: string;
    count?: number;
    lat?: number;
    lng?: number;
  };
}) {
  const [state, action, pending] = useActionState(saveDijasporaCountry, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="flag">Zastava (emoji)</label>
        <input id="flag" name="flag" defaultValue={item?.flag} />
      </div>
      <div className="field">
        <label htmlFor="ct-name">Država</label>
        <input id="ct-name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="ct-count">Broj</label>
        <input id="ct-count" name="count" defaultValue={item?.count} />
      </div>
      <div className="field">
        <label htmlFor="ct-lat">Lat</label>
        <input id="ct-lat" name="lat" defaultValue={item?.lat} />
      </div>
      <div className="field">
        <label htmlFor="ct-lng">Lng</label>
        <input id="ct-lng" name="lng" defaultValue={item?.lng} />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function PozdraviSettingsForm({
  item,
}: {
  item?: { id?: string; illustrative?: boolean; note?: string };
}) {
  const [state, action, pending] = useActionState(savePozdraviSettings, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 24 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Pozdravi — postavke</h2>
      <div className="field">
        <label htmlFor="pz-note">Napomena</label>
        <textarea id="pz-note" name="note" rows={3} defaultValue={item?.note} required />
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="illustrative" defaultChecked={item?.illustrative ?? true} />{" "}
          Ilustrativno
        </label>
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function PozdravItemForm({
  item,
}: {
  item?: { id?: string; name?: string; loc?: string; text?: string };
}) {
  const [state, action, pending] = useActionState(savePozdravItem, initial);
  return (
    <form action={action} className="screen-card" style={{ marginBottom: 16 }}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="pz-name">Ime</label>
        <input id="pz-name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="pz-loc">Lokacija</label>
        <input id="pz-loc" name="loc" defaultValue={item?.loc} />
      </div>
      <div className="field">
        <label htmlFor="pz-text">Tekst</label>
        <textarea id="pz-text" name="text" rows={3} defaultValue={item?.text} required />
      </div>
      <Feedback state={state} />
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj pozdrav
      </button>
    </form>
  );
}
