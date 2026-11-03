import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  HelpCircle,
  Images,
  LayoutDashboard,
  Network,
  MessageSquareQuote,
  Newspaper,
  Settings,
  ShieldCheck,
  Tags,
  Trophy,
  Users,
  MessageSquareWarning,
} from "lucide-react";

export const adminNavIcons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  news: Newspaper,
  categories: Tags,
  gallery: Images,
  organization: Network,
  achievements: Trophy,
  testimonials: MessageSquareQuote,
  faqs: HelpCircle,
  integrity: ShieldCheck,
  services: Briefcase,
  complaints: MessageSquareWarning,
  settings: Settings,
  users: Users,
};
