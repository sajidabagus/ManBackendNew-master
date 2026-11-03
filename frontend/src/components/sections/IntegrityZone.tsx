import { Mail, Phone, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import type { IntegrityZoneData } from "@/types/public";

interface IntegrityZoneProps {
  section: IntegrityZoneData;
}

export function IntegrityZone({ section }: IntegrityZoneProps) {
  return (
    <section
      id="zona-integritas"
      className="section-padding relative bg-slate-50 dark:bg-teal-950/40"
    >
      <div className="container-custom">
        <SectionHeading
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {section.imageUrl && (
            <FadeIn>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft dark:border-teal-800/50 dark:bg-teal-950/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </FadeIn>
          )}

          <FadeIn delay={section.imageUrl ? 120 : 0}>
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-teal-800/50 dark:text-teal-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="font-display text-lg font-bold text-secondary-dark dark:text-white">
                  Komitmen Integritas
                </p>
              </div>

              <p className="mb-6 leading-relaxed text-slate-600 dark:text-teal-200/90">
                {section.description}
              </p>

              <ul className="space-y-3">
                {section.commitments.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-teal-100/90 sm:text-base"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:border-teal-600/30 dark:bg-teal-900/40">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary dark:text-teal-300">
                  {section.contactLabel}
                </p>
                <div className="space-y-2 text-sm sm:text-base">
                  {section.contactEmail && (
                    <a
                      href={`mailto:${section.contactEmail}`}
                      className="flex items-center gap-2 font-medium text-secondary-dark transition hover:text-primary dark:text-white dark:hover:text-teal-200"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {section.contactEmail}
                    </a>
                  )}
                  {section.contactPhone && (
                    <a
                      href={`tel:${section.contactPhone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 font-medium text-secondary-dark transition hover:text-primary dark:text-white dark:hover:text-teal-200"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {section.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
