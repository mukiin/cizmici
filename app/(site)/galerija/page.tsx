import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GalleryUploadForm } from "@/components/GalleryUploadForm";
import { PageBand } from "@/components/PageBand";
import { listGalleryImages } from "@/lib/actions/gallery";

export const metadata: Metadata = { title: "Galerija" };
export const dynamic = "force-dynamic";

export default async function GalerijaPage() {
  const session = await auth();
  const images = await listGalleryImages();
  const meId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";

  const items = images.map((img) => ({
    id: img.id,
    caption: img.caption,
    width: img.width,
    height: img.height,
    createdAt: img.createdAt.toISOString(),
    authorName: img.authorName,
    authorId: img.authorId,
    canDelete: Boolean(meId && (meId === img.authorId || isAdmin)),
  }));

  return (
    <>
      <PageBand
        kicker="Slike mjesta"
        title="Galerija"
        lead="Fotografije Čizmića koje dijele mještani. Uz svaku sliku stoji ko ju je dodao."
      />
      <section className="tight">
        <div className="wrap">
          {session?.user ? (
            <GalleryUploadForm />
          ) : (
            <p className="screen-card" style={{ marginBottom: 28 }}>
              Da dodate sliku, <Link href="/prijava?callbackUrl=/galerija">prijavite se</Link>.
            </p>
          )}

          {items.length === 0 ? <p>Još nema slika. Budite prvi.</p> : <GalleryGrid images={items} />}
        </div>
      </section>
    </>
  );
}
