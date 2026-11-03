"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { shouldUnoptimizeMedia } from "@/lib/media-url";
import type { GalleryDisplayImage } from "@/types/public";

export function GalleryGrid({
  images,
  layout = "masonry",
}: {
  images: GalleryDisplayImage[];
  layout?: "masonry" | "uniform";
}) {
  const [modal, setModal] = useState<{ src: string; alt: string } | null>(null);
  const uniform = layout === "uniform";

  return (
    <>
      <div
        className={
          uniform
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            : "grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-4"
        }
      >
        {images.map((img, i) => (
          <FadeIn
            key={img.id}
            delay={Math.min(i, 8) * 40}
            className={cn(
              "relative overflow-hidden rounded-2xl",
              uniform ? "aspect-square h-auto" : img.span,
            )}
          >
            <button
              type="button"
              className="group relative h-full w-full"
              onClick={() => setModal({ src: img.src, alt: img.alt })}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                unoptimized={shouldUnoptimizeMedia(img.src)}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-secondary-dark/0 transition-colors group-hover:bg-secondary-dark/40" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                  <ZoomIn className="h-6 w-6" />
                </span>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setModal(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setModal(null)}
            aria-label="Tutup"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={modal.src}
              alt={modal.alt}
              width={1200}
              height={800}
              unoptimized={shouldUnoptimizeMedia(modal.src)}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
