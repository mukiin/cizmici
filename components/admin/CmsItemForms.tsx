"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import {
  saveBusinessItem,
  saveEventItem,
  saveProjectItem,
} from "@/lib/actions/editorial";

const initial: ActionState = { ok: false };

export function ProjectForm({
  item,
}: {
  item?: {
    id?: string;
    title?: string;
    body?: string;
    year?: string;
    meta?: string;
    status?: string;
    statusLabel?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveProjectItem, initial);
  return (
    <form action={action} className="screen-card">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="title">Naslov</label>
        <input id="title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="body">Opis</label>
        <textarea id="body" name="body" rows={4} defaultValue={item?.body} required />
      </div>
      <div className="field">
        <label htmlFor="year">Godina</label>
        <input id="year" name="year" defaultValue={item?.year} />
      </div>
      <div className="field">
        <label htmlFor="meta">Meta</label>
        <input id="meta" name="meta" defaultValue={item?.meta} />
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={item?.status ?? "planned"}>
          <option value="done">Završeno</option>
          <option value="progress">U toku</option>
          <option value="planned">Planirano</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="statusLabel">Oznaka statusa</label>
        <input id="statusLabel" name="statusLabel" defaultValue={item?.statusLabel} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function BusinessForm({
  item,
}: {
  item?: {
    id?: string;
    name?: string;
    tag?: string;
    body?: string;
    founded?: string;
    location?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveBusinessItem, initial);
  return (
    <form action={action} className="screen-card">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="name">Naziv</label>
        <input id="name" name="name" defaultValue={item?.name} required />
      </div>
      <div className="field">
        <label htmlFor="tag">Oznaka</label>
        <input id="tag" name="tag" defaultValue={item?.tag} />
      </div>
      <div className="field">
        <label htmlFor="body">Opis</label>
        <textarea id="body" name="body" rows={4} defaultValue={item?.body} required />
      </div>
      <div className="field">
        <label htmlFor="founded">Osnovano</label>
        <input id="founded" name="founded" defaultValue={item?.founded} />
      </div>
      <div className="field">
        <label htmlFor="location">Lokacija</label>
        <input id="location" name="location" defaultValue={item?.location} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}

export function EventForm({
  item,
}: {
  item?: {
    id?: string;
    day?: string;
    month?: string;
    title?: string;
    meta?: string;
    recurring?: boolean;
    illustrative?: boolean;
  };
}) {
  const [state, action, pending] = useActionState(saveEventItem, initial);
  return (
    <form action={action} className="screen-card">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="day">Dan</label>
        <input id="day" name="day" defaultValue={item?.day} required />
      </div>
      <div className="field">
        <label htmlFor="month">Mjesec</label>
        <input id="month" name="month" defaultValue={item?.month} required />
      </div>
      <div className="field">
        <label htmlFor="title">Naslov</label>
        <input id="title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="meta">Meta</label>
        <input id="meta" name="meta" defaultValue={item?.meta} />
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="recurring" defaultChecked={item?.recurring} /> Ponavljajući
        </label>
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="illustrative" defaultChecked={item?.illustrative} />{" "}
          Ilustrativno
        </label>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        Sačuvaj
      </button>
    </form>
  );
}
