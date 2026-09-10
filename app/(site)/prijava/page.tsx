import type { Metadata } from "next";
import { isGoogleAuthEnabled } from "@/auth";
import { AuthPanel } from "@/components/AuthPanel";
import { PageBand } from "@/components/PageBand";

export const metadata: Metadata = { title: "Prijava" };

export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";
  const googleEnabled = isGoogleAuthEnabled;

  return (
    <>
      <PageBand
        kicker="Nalog"
        title="Prijava"
        lead={
          googleEnabled
            ? "Prijavite se Googleom ili emailom. Admin ostaje email + lozinka."
            : "Registracija i prijava emailom. Google: postavi GOOGLE_CLIENT_ID/SECRET."
        }
      />
      <section className="tight">
        <div className="wrap">
          <AuthPanel callbackUrl={callbackUrl} googleEnabled={googleEnabled} />
        </div>
      </section>
    </>
  );
}
