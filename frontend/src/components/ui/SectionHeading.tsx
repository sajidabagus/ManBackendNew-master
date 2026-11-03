import { FadeIn } from "./FadeIn";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <FadeIn className={cn("mb-12 md:mb-16", align === "center" && "text-center")}>
      {badge && (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest",
            light
              ? "bg-white/20 text-accent-light"
              : "bg-primary/10 text-primary dark:bg-teal-500/20 dark:text-teal-300"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight",
          light ? "text-white" : "text-secondary-dark dark:text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            light
              ? "text-teal-100/90"
              : "text-slate-600 dark:text-teal-200/80"
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-accent-light",
          align === "center" && "mx-auto"
        )}
      />
    </FadeIn>
  );
}
