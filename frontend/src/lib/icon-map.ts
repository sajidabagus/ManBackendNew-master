import {
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Laptop,
  Library,
  Monitor,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const serviceIconMap: Record<string, LucideIcon> = {
  "clipboard-list": ClipboardList,
  "graduation-cap": GraduationCap,
  monitor: Monitor,
  laptop: Laptop,
  "book-open": BookOpen,
  library: Library,
};

const statIconMap: Record<string, LucideIcon> = {
  users: Users,
  "graduation-cap": GraduationCap,
  trophy: Trophy,
  building: Building2,
};

const serviceColors = [
  "from-primary to-primary-700",
  "from-accent to-accent-dark",
  "from-teal-600 to-secondary",
  "from-emerald-500 to-primary",
  "from-primary-500 to-teal-700",
  "from-secondary to-secondary-dark",
];

export function getServiceIcon(name?: string): LucideIcon {
  return serviceIconMap[name ?? ""] ?? GraduationCap;
}

export function getStatIcon(name?: string): LucideIcon {
  return statIconMap[name ?? ""] ?? Users;
}

export function getServiceColor(index: number): string {
  return serviceColors[index % serviceColors.length];
}
