"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/actions/auth";
import { uploadGalleryImage } from "@/lib/actions/gallery";

const initial: ActionState = { ok: false };

export function GalleryUploadForm() {
  const [state, action, pending] = useActionState(uploadGalleryImage, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const lastOk = useRef(false);

  useEffect(() => {
    if (state.ok && !lastOk.current) {
      formRef.current?.reset();
    }
    lastOk.current = Boolean(state.ok);
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="screen-card" style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: "1.15rem", marginBottom: 12 }}>Dodaj sliku Čizmića</h2>
      <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.55)", marginBottom: 16 }}>
        Slika se automatski kompresuje u WebP (max ~1280px) da zauzme što manje prostora.
      </p>
      <div className="field">
        <label htmlFor="gallery-image">Slika</label>
        <input id="gallery-image" name="image" type="file" accept="image/*" required />
      </div>
      <div className="field">
        <label htmlFor="gallery-caption">Opis (opcionalno)</label>
        <input id="gallery-caption" name="caption" maxLength={200} placeholder="npr. Dan MZ 2024" />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.message}</p> : null}
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Upload i kompresija…" : "Objavi sliku"}
      </button>
    </form>
  );
}
