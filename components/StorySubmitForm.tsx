"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { submitStory } from "@/lib/actions/content";

const initial: ActionState = { ok: false };

export function StorySubmitForm() {
  const [state, action, pending] = useActionState(submitStory, initial);

  return (
    <form action={action} className="screen-card" style={{ marginBottom: 28 }}>
      <h3 style={{ marginBottom: 12 }}>Pošalji priču</h3>
      <div className="field">
        <label htmlFor="story-title">Naslov</label>
        <input id="story-title" name="title" required minLength={4} maxLength={160} />
      </div>
      <div className="field">
        <label htmlFor="story-body">Tekst</label>
        <textarea id="story-body" name="body" rows={5} required minLength={20} maxLength={12000} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok && state.message ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Slanje…" : "Pošalji na odobrenje"}
      </button>
    </form>
  );
}
