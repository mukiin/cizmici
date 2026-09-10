"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { deleteGalleryImage } from "@/lib/actions/gallery";

export type GalleryGridItem = {
  id: string;
  caption: string | null;
  width: number;
  height: number;
  createdAt: string;
  authorName: string;
  authorId: string;
  canDelete: boolean;
};

type Props = {
  images: GalleryGridItem[];
};

export function GalleryGrid({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, showPrev, showNext]);

  const current = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <figure key={img.id} className="gallery-card">
            <button
              type="button"
              className="gallery-thumb"
              onClick={() => setOpenIndex(index)}
              aria-label={`Otvori sliku: ${img.caption || img.authorName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/galerija/${img.id}`}
                alt={img.caption || `Slika — ${img.authorName}`}
                width={img.width}
                height={img.height}
                loading="lazy"
              />
            </button>
            <figcaption>
              <div className="gallery-author">{img.authorName}</div>
              {img.caption ? <div className="gallery-caption">{img.caption}</div> : null}
              <div className="meta">{new Date(img.createdAt).toLocaleDateString("bs-BA")}</div>
              {img.canDelete ? (
                <form action={deleteGalleryImage} style={{ marginTop: 8 }}>
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" className="btn ghost">
                    Obriši
                  </button>
                </form>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>

      {current && openIndex !== null ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Pregled galerije"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? start) - start;
            if (Math.abs(dx) < 50) return;
            if (dx > 0) showPrev();
            else showNext();
          }}
        >
          <button type="button" className="gallery-lb-close" onClick={close} aria-label="Zatvori">
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="gallery-lb-nav gallery-lb-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Prethodna slika"
              >
                ‹
              </button>
              <button
                type="button"
                className="gallery-lb-nav gallery-lb-next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Sljedeća slika"
              >
                ›
              </button>
            </>
          ) : null}
          <div
            className="gallery-lb-stage"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/galerija/${current.id}`}
              alt={current.caption || `Slika — ${current.authorName}`}
            />
            <div className="gallery-lb-meta">
              <strong>{current.authorName}</strong>
              {current.caption ? <span>{current.caption}</span> : null}
              <span className="gallery-lb-count">
                {openIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
