export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  message: string;
  token: string;
  user: ApiUser;
}

export interface CaptchaResponse {
  captcha_id: string;
  question: string;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string | null;
  thumbnail_url?: string | null;
  status: "draft" | "published";
  published_at?: string | null;
  views: number;
  category?: NewsCategory;
  author?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: number;
  gallery_id: number;
  path: string;
  url: string;
  alt?: string;
  sort_order: number;
}

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  status: "draft" | "published";
  published_at?: string | null;
  images_count?: number;
  images?: GalleryImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface AchievementItem {
  id: number;
  title: string;
  year: number;
  level: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  graduation_year?: number | null;
  occupation?: string | null;
  quote: string;
  photo?: string | null;
  photo_url?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SettingItem {
  id: number;
  key: string;
  value: string | null;
  group: string;
  type: string;
  url?: string;
}

export interface SettingsResponse {
  data: SettingItem[];
  grouped: Record<string, Record<string, string>>;
}

export interface DashboardStats {
  total_students: number;
  total_news: number;
  total_services: number;
  total_galleries: number;
  published_news: number;
  draft_news: number;
  visitor_total: number;
  visitor_today: number;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  analytics: {
    visitor_chart: {
      labels: string[];
      page_views: number[];
      unique_visitors: number[];
    };
    news_chart: { month: string; total: number }[];
    recent_news: NewsItem[];
  };
}
