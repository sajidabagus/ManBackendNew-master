"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  graduationYear?: number | null;
  occupation?: string | null;
  quote: string;
  photoUrl?: string | null;
}

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary-dark transition hover:bg-primary/5 dark:border-teal-700 dark:bg-teal-900/60 dark:text-white"
          aria-label="Geser kiri"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary-dark transition hover:bg-primary/5 dark:border-teal-700 dark:bg-teal-900/60 dark:text-white"
          aria-label="Geser kanan"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
      >
        {testimonials.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="w-[300px] shrink-0 snap-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-teal-800/50 dark:bg-teal-950/60 sm:w-[360px]"
          >
            <Quote className="mb-4 h-8 w-8 text-primary/40" />
            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-teal-200/90 sm:text-base">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-teal-800">
              {item.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                  {item.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-display font-semibold text-secondary-dark dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-teal-400">
                  {item.occupation}
                  {item.graduationYear ? ` · Lulus ${item.graduationYear}` : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
