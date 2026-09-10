import type { Metadata } from "next";
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

  return (
    <>
      <PageBand
        kicker="Nalog"
        title="Prijava"
        lead="Registracija i prijava emailom. Google prijava dolazi u kasnijoj fazi."
      />
      <section className="tight">
        <div className="wrap">
          <AuthPanel callbackUrl={callbackUrl} />
        </div>
      </section>
    </>
  );
}
