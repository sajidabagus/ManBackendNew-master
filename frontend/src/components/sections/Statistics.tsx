import { schoolStats, type StatItemData } from "@/lib/data";
import { getStatIcon } from "@/lib/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StatisticsProps {
  stats?: StatItemData[];
}

export function Statistics({ stats = schoolStats }: StatisticsProps) {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-50 dark:bg-teal-950/50">
      <div className="islamic-pattern absolute inset-0 opacity-50" />
      <div className="container-custom relative">
        <SectionHeading
          badge="Data Sekolah"
          title="Statistik MAN 2 Kota Madiun"
          subtitle="Angka yang mencerminkan komitmen kami dalam memberikan pendidikan berkualitas."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = getStatIcon(stat.icon);
            return (
              <FadeIn key={stat.label} delay={i * 80}>
                <div className="group glass-card flex flex-col items-center p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-teal-800/50 dark:text-teal-300 dark:group-hover:bg-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="font-display text-3xl font-bold text-secondary-dark dark:text-white sm:text-4xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-teal-300/80">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
