"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { createForumTopic } from "@/lib/actions/forum";

const initial: ActionState = { ok: false };

export function ForumTopicForm() {
  const [state, action, pending] = useActionState(createForumTopic, initial);

  return (
    <form action={action} className="screen-card" style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Nova tema</h2>
      <div className="field">
        <label htmlFor="forum-title">Naslov</label>
        <input id="forum-title" name="title" required minLength={4} maxLength={160} />
      </div>
      <div className="field">
        <label htmlFor="forum-body">Tekst</label>
        <textarea id="forum-body" name="body" rows={5} required minLength={10} maxLength={8000} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Objavljivanje…" : "Objavi temu"}
      </button>
    </form>
  );
}
