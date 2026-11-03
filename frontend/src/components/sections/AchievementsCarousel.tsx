"use client";

import { useRef } from "react";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";

interface Achievement {
  title: string;
  year: number;
  level: string;
}

export function AchievementsCarousel({
  achievements,
}: {
  achievements: Achievement[];
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Geser kiri"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Geser kanan"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
      >
        {achievements.map((item, index) => (
          <div
            key={`${item.title}-${item.year}-${index}`}
            className="w-[280px] shrink-0 snap-start rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition hover:bg-white/15 sm:w-[320px]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-light">
              <Trophy className="h-6 w-6" />
            </div>
            <p className="font-display text-lg font-bold text-white">
              {item.title}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="rounded-full bg-white/20 px-3 py-1 text-teal-100">
                {item.level}
              </span>
              <span className="font-semibold text-accent-light">
                {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
