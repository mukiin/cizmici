"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { createForumComment } from "@/lib/actions/forum";

const initial: ActionState = { ok: false };

export function ForumCommentForm({ topicId }: { topicId: string }) {
  const [state, action, pending] = useActionState(createForumComment, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const lastOk = useRef(false);

  useEffect(() => {
    if (state.ok && !lastOk.current) {
      formRef.current?.reset();
    }
    lastOk.current = Boolean(state.ok);
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="screen-card" style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Komentar</h2>
      <input type="hidden" name="topicId" value={topicId} />
      <div className="field">
        <label htmlFor="forum-comment">Vaš komentar</label>
        <textarea id="forum-comment" name="body" rows={4} required minLength={2} maxLength={4000} />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok && state.message ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Objavljivanje…" : "Objavi komentar"}
      </button>
    </form>
  );
}
