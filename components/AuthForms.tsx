"use client";

import { useActionState } from "react";
import {
  loginMember,
  loginWithGoogle,
  registerMember,
  type ActionState,
} from "@/lib/actions/auth";

const initial: ActionState = { ok: false };

export function AuthForms({
  callbackUrl = "/",
  googleEnabled = false,
}: {
  callbackUrl?: string;
  googleEnabled?: boolean;
}) {
  const [loginState, loginAction, loginPending] = useActionState(loginMember, initial);
  const [registerState, registerAction, registerPending] = useActionState(
    registerMember,
    initial,
  );

  return (
    <div className="grid-2">
      <div className="screen-card auth-box">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Prijava</h2>
        <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.55)", marginBottom: 22 }}>
          Email i lozinka{googleEnabled ? ", ili Google nalog" : ""}.
        </p>

        {googleEnabled ? (
          <form action={loginWithGoogle} style={{ marginBottom: 18 }}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button type="submit" className="btn ghost" style={{ width: "100%" }}>
              Nastavi s Googleom
            </button>
          </form>
        ) : null}

        {googleEnabled ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "rgba(33,29,22,0.45)",
              marginBottom: 18,
            }}
          >
            ili emailom
          </p>
        ) : null}

        <form action={loginAction}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="field">
            <label htmlFor="login-email">E-mail adresa</label>
            <input id="login-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="login-password">Lozinka</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
            />
          </div>
          {loginState.error ? <p className="form-error">{loginState.error}</p> : null}
          <button type="submit" className="btn primary" style={{ width: "100%" }} disabled={loginPending}>
            {loginPending ? "Prijava…" : "Prijavi se"}
          </button>
        </form>
      </div>

      <div className="screen-card auth-box">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Registracija</h2>
        <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.55)", marginBottom: 22 }}>
          Nalog mještanina za priče i prijave.
          {googleEnabled ? " Brže: koristi Google lijevo." : ""}
        </p>
        <form action={registerAction}>
          <div className="field">
            <label htmlFor="reg-name">Ime i prezime</label>
            <input id="reg-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="reg-email">E-mail adresa</label>
            <input id="reg-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="reg-password">Lozinka</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {registerState.error ? <p className="form-error">{registerState.error}</p> : null}
          <button
            type="submit"
            className="btn primary"
            style={{ width: "100%" }}
            disabled={registerPending}
          >
            {registerPending ? "Kreiranje…" : "Kreiraj nalog"}
          </button>
        </form>
      </div>
    </div>
  );
}
