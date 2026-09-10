"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { saveHistorijaItem } from "@/lib/actions/editorial";

const initial: ActionState = { ok: false };

type Item = {
  id?: string;
  slug?: string;
  year?: string;
  title?: string;
  body?: string;
  source?: string;
  featured?: boolean;
  detail?: string[];
};

export function HistorijaForm({ item }: { item?: Item }) {
  const [state, action, pending] = useActionState(saveHistorijaItem, initial);

  return (
    <form action={action} className="screen-card">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field">
        <label htmlFor="year">Godina</label>
        <input id="year" name="year" defaultValue={item?.year} required />
      </div>
      <div className="field">
        <label htmlFor="slug">Slug (URL)</label>
        <input id="slug" name="slug" defaultValue={item?.slug} placeholder="npr. 2011-upis-mz" />
      </div>
      <div className="field">
        <label htmlFor="title">Naslov</label>
        <input id="title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="body">Kratki opis</label>
        <textarea id="body" name="body" rows={3} defaultValue={item?.body} required />
      </div>
      <div className="field">
        <label htmlFor="detail">Detalji (jedan pasus po redu)</label>
        <textarea
          id="detail"
          name="detail"
          rows={8}
          defaultValue={item?.detail?.join("\n\n") ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="source">Izvor</label>
        <select id="source" name="source" defaultValue={item?.source ?? "public"}>
          <option value="official">Službeni</option>
          <option value="verified">Provjeren</option>
          <option value="public">Javni</option>
        </select>
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} /> Featured
          na početnoj
        </label>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok && state.message ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Čuvanje…" : "Sačuvaj"}
      </button>
    </form>
  );
}
