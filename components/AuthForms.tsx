"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AuthForms({
  callbackUrl = "/",
  googleEnabled = false,
}: {
  callbackUrl?: string;
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);
  const [registerPending, setRegisterPending] = useState(false);

  async function afterAuth(href: string) {
    await update();
    router.refresh();
    router.push(href);
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setLoginPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await signIn("credentials", {
        email: String(form.get("email") || "").toLowerCase(),
        password: String(form.get("password") || ""),
        redirect: false,
      });
      if (res?.error) {
        setLoginError("Pogrešan email ili lozinka.");
        return;
      }
      await afterAuth(callbackUrl.startsWith("/") ? callbackUrl : "/");
    } finally {
      setLoginPending(false);
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterError(null);
    setRegisterPending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setRegisterError(json.error || "Registracija nije uspjela.");
        return;
      }
      const login = await signIn("credentials", {
        email: String(data.get("email") || "").toLowerCase(),
        password: String(data.get("password") || ""),
        redirect: false,
      });
      if (login?.error) {
        setRegisterError("Nalog je kreiran, ali prijava nije uspjela.");
        return;
      }
      await afterAuth("/price");
    } finally {
      setRegisterPending(false);
    }
  }

  function onGoogle() {
    void signIn("google", {
      callbackUrl: callbackUrl.startsWith("/") ? callbackUrl : "/",
    });
  }

  return (
    <div className="grid-2">
      <div className="screen-card auth-box">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Prijava</h2>
        <p style={{ fontSize: "0.86rem", color: "rgba(33,29,22,0.55)", marginBottom: 22 }}>
          Email i lozinka{googleEnabled ? ", ili Google nalog" : ""}.
        </p>

        {googleEnabled ? (
          <button
            type="button"
            className="btn ghost"
            style={{ width: "100%", marginBottom: 18 }}
            onClick={onGoogle}
          >
            Nastavi s Googleom
          </button>
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

        <form onSubmit={onLogin}>
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
          {loginError ? <p className="form-error">{loginError}</p> : null}
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
        <form onSubmit={onRegister}>
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
          {registerError ? <p className="form-error">{registerError}</p> : null}
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
