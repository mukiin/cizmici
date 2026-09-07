"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { submitIssue } from "@/lib/actions/content";

const initial: ActionState = { ok: false };

export function IssueSubmitForm() {
  const [state, action, pending] = useActionState(submitIssue, initial);

  return (
    <form action={action} className="screen-card">
      <div className="field">
        <label htmlFor="vrsta">Vrsta problema</label>
        <select id="vrsta" name="kind" defaultValue="put" required>
          <option value="put">Oštećen put</option>
          <option value="rasvjeta">Rasvjeta</option>
          <option value="deponija">Divlja deponija</option>
          <option value="ostalo">Ostalo</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="lokacija">Lokacija</label>
        <input
          id="lokacija"
          name="location"
          placeholder="npr. put Čizmići–Kapići"
          required
          minLength={3}
        />
      </div>
      <div className="field">
        <label htmlFor="opis">Opis</label>
        <textarea id="opis" name="body" rows={3} placeholder="Opišite problem..." required minLength={10} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok && state.message ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Slanje…" : "Pošalji prijavu"}
      </button>
    </form>
  );
}
