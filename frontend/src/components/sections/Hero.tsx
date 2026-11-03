import Image from "next/image";
import { Sparkles } from "lucide-react";
import { heroFloatingStats } from "@/lib/data";
import { shouldUnoptimizeMedia } from "@/lib/media-url";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=85";

interface HeroProps {
  heroImage?: string;
  tagline?: string;
  schoolName?: string;
}

export function Hero({
  heroImage,
  tagline = "MAN 2 Kota Madiun — membentuk generasi Qur'ani yang unggul akademik, berakhlak mulia, dan mahir teknologi digital untuk masa depan Indonesia emas.",
  schoolName,
}: HeroProps) {
  const backgroundSrc = heroImage || DEFAULT_HERO_IMAGE;
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={backgroundSrc}
          alt={schoolName ?? "Gedung MAN 2 Kota Madiun"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={shouldUnoptimizeMedia(backgroundSrc)}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="islamic-pattern absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-emerald-mesh" />
      </div>

      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full border border-accent/20 opacity-40" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 h-64 w-64 rounded-full border border-teal-300/20" />

      <div className="container-custom relative z-10 px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="animate-hero-rise opacity-0">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-light backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Madrasah Digital Modern
              </span>
            </div>

            <h1 className="animate-hero-rise hero-delay-1 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-[3.5rem]">
              Madrasah Digital Modern{" "}
              <span className="text-gradient-gold">Berprestasi</span>
            </h1>

            <p className="animate-hero-rise hero-delay-2 mt-6 max-w-xl text-base leading-relaxed text-teal-100/90 opacity-0 sm:text-lg">
              {tagline}
            </p>

 
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative ml-auto max-w-sm">
              {heroFloatingStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass-card animate-hero-rise mb-4 border-white/30 p-5 opacity-0 last:mb-0"
                  style={{ marginLeft: i * 24, animationDelay: `${0.4 + i * 0.15}s` }}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-200/80">
                    {stat.label}
                  </p>
                  <p className="font-display text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-teal-100/70">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-hero-rise hero-delay-5 mt-10 grid grid-cols-3 gap-3 opacity-0 lg:hidden">
          {heroFloatingStats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl border border-white/20 p-3 text-center backdrop-blur-md"
            >
              <p className="font-display text-xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-[10px] text-teal-200/80">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-bounce-soft absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
