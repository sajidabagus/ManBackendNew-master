import { ArrowUpRight } from "lucide-react";
import { digitalServices } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { getServiceColor, getServiceIcon } from "@/lib/icon-map";
import type { ServiceItem } from "@/types/api";

interface DigitalServicesProps {
  services?: ServiceItem[];
}

export function DigitalServices({ services }: DigitalServicesProps) {
  const items =
    services && services.length > 0
      ? services.map((s, i) => ({
          title: s.title,
          description: s.description ?? "",
          href: s.url ?? "#",
          icon: getServiceIcon(s.icon),
          color: getServiceColor(i),
        }))
      : process.env.NODE_ENV !== "production"
        ? digitalServices.map((s, i) => ({
            ...s,
            icon: getServiceIcon(s.icon),
            color: s.color ?? getServiceColor(i),
          }))
        : [];

  if (items.length === 0) return null;

  return (
    <section id="layanan" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 dark:from-teal-900/30" />
      <div className="islamic-pattern absolute inset-0" />
      <div className="container-custom relative">
        <SectionHeading
          badge="Layanan Digital"
          title="Layanan Madrasah Digital"
          subtitle="Akses layanan sekolah secara online — cepat, transparan, dan terintegrasi."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((service, i) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.title + i} delay={i * 60}>
                <a
                  href={service.href}
                  target={String(service.href).startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group block rounded-2xl bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-soft-lg dark:bg-teal-950/80 dark:shadow-none dark:ring-1 dark:ring-teal-800/50"
                >
                  <div
                    className={cn(
                      "mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft",
                      service.color
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-secondary-dark dark:text-white">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-teal-300/70">
                    {service.description}
                  </p>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
