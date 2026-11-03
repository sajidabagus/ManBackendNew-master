import type { GalleryItem, NewsItem, ServiceItem, AchievementItem, FaqItem, TestimonialItem } from "./api";

export interface PublicStats {
  total_students: number;
  total_teachers: number;
  total_prestasi: number;
  total_ruang: number;
}

export interface PublicHomeData {
  settings: Record<string, Record<string, string>>;
  news: NewsItem[];
  services: ServiceItem[];
  achievements: AchievementItem[];
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  galleries: GalleryItem[];
  stats: PublicStats;
}

export interface GalleryDisplayImage {
  id: number;
  src: string;
  alt: string;
  span: string;
}

export interface AchievementSectionData {
  badge: string;
  title: string;
  subtitle: string;
  counters: { label: string; value: number }[];
  items: { title: string; year: number; level: string }[];
}

export interface FaqSectionData {
  badge: string;
  title: string;
  subtitle: string;
  items: { question: string; answer: string; category?: string | null }[];
}

export interface TestimonialSectionData {
  badge: string;
  title: string;
  subtitle: string;
  items: {
    name: string;
    graduationYear?: number | null;
    occupation?: string | null;
    quote: string;
    photoUrl?: string | null;
  }[];
}

export interface IntegrityZoneData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  commitments: string[];
  contactLabel: string;
  contactEmail: string;
  contactPhone: string;
  imageUrl?: string;
}

export interface SchoolProfile {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  principalName: string;
  principalTitle: string;
  principalGreeting: string;
  principalVision: string;
  principalMission: string[];
  accreditation: string;
  logoUrl?: string;
  heroImageUrl?: string;
  orgChartImageUrl?: string;
  orgChartTitle?: string;
  principalPhotoUrl?: string;
  social: { label: string; href: string }[];
}
