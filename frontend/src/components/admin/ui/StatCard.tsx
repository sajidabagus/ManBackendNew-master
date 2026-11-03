import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-soft backdrop-blur-sm dark:border-teal-800/50 dark:bg-teal-950/60",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-teal-300/80">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-secondary-dark dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-primary dark:text-teal-300">
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-teal-800/50 dark:text-teal-200">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
