import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AchievementsCarousel } from "./AchievementsCarousel";
import type { AchievementSectionData } from "@/types/public";

export function Achievements({ section }: { section: AchievementSectionData }) {
  return (
    <section id="prestasi" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-secondary-dark" />
      <div className="islamic-pattern absolute inset-0 opacity-30" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
          light
        />

        <div className="mb-12 grid grid-cols-3 gap-4 sm:gap-8">
          {section.counters.map((item, i) => (
            <FadeIn key={item.label} delay={i * 100}>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md sm:p-6">
                <p className="font-display text-2xl font-bold text-white sm:text-4xl">
                  <AnimatedCounter value={item.value} suffix="+" />
                </p>
                <p className="mt-1 text-xs text-teal-100/80 sm:text-sm">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <AchievementsCarousel achievements={section.items} />
      </div>
    </section>
  );
}
