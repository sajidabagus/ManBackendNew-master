import { cache } from "react";
import type { GalleryItem, NewsItem, ServiceItem, AchievementItem, FaqItem, TestimonialItem } from "@/types/api";
import type { PublicHomeData } from "@/types/public";
import { schoolInfo, socialLinks, achievements as fallbackAchievements, achievementCounters as fallbackCounters, fallbackFaqs, fallbackTestimonials } from "@/lib/data";
import { normalizeMediaUrl, normalizeSettingsMedia } from "@/lib/media-url";
import { fetchPublicJson } from "@/lib/api/public-base";

const useDemoContent = process.env.NODE_ENV !== "production";



/** Unwrap Laravel JsonResource `{ data: [...] }` wrappers */

function unwrapList<T>(value: unknown): T[] {

  if (Array.isArray(value)) return value as T[];

  if (

    value &&

    typeof value === "object" &&

    "data" in value &&

    Array.isArray((value as { data: unknown }).data)

  ) {

    return (value as { data: T[] }).data;

  }

  return [];

}



function normalizeHomePayload(raw: unknown): PublicHomeData {

  const body = (raw && typeof raw === "object" ? raw : {}) as Record<

    string,

    unknown

  >;



  const stats = (body.stats && typeof body.stats === "object"

    ? body.stats

    : {}) as PublicHomeData["stats"];



  return {

    settings: normalizeSettingsMedia(
      (body.settings && typeof body.settings === "object"
        ? body.settings
        : {}) as PublicHomeData["settings"],
    ),

    news: unwrapList<NewsItem>(body.news).map((n) => ({
      ...n,
      thumbnail_url: normalizeMediaUrl(n.thumbnail_url) ?? n.thumbnail_url,
    })),

    services: unwrapList(body.services),

    achievements: unwrapList<AchievementItem>(body.achievements),

    faqs: unwrapList<FaqItem>(body.faqs),

    testimonials: unwrapList<TestimonialItem>(body.testimonials).map((t) => ({
      ...t,
      photo_url: normalizeMediaUrl(t.photo_url) ?? t.photo_url,
    })),

    galleries: unwrapList<GalleryItem>(body.galleries).map((g) => ({
      ...g,
      images: (g.images ?? []).map((img) => ({
        ...img,
        url: normalizeMediaUrl(img.url) ?? img.url,
      })),
    })),

    stats: {

      total_students: Number(stats.total_students) || 1248,

      total_teachers: Number(stats.total_teachers) || 86,

      total_prestasi: Number(stats.total_prestasi) || 320,

      total_ruang: Number(stats.total_ruang) || 36,

    },

  };

}



export const fetchPublicHome = cache(async (): Promise<PublicHomeData> => {
  const json = await fetchPublicJson("/public/home");
  if (!json) return getFallbackHomeData();
  return normalizeHomePayload(json);
});

export async function fetchPublicGalleries(): Promise<
  PublicHomeData["galleries"]
> {
  const json = await fetchPublicJson("/public/galleries");
  if (!json || typeof json !== "object") return [];
  const list = unwrapList<GalleryItem>(
    (json as { data?: unknown }).data ?? json,
  );
  return list.map((g) => ({
    ...g,
    images: (g.images ?? []).map((img) => ({
      ...img,
      url: normalizeMediaUrl(img.url) ?? img.url,
    })),
  }));
}

export async function fetchPublicNews(slug: string): Promise<NewsItem | null> {
  const json = await fetchPublicJson(`/public/news/${slug}`);
  if (!json || typeof json !== "object") return null;
  const item = (json as { data?: unknown }).data ?? json;
  return item && typeof item === "object" ? (item as NewsItem) : null;
}



function getFallbackHomeData(): PublicHomeData {

  return {

    settings: {},

    news: [],

    services: [],

    achievements: [],

    faqs: [],

    testimonials: [],

    galleries: [],

    stats: {

      total_students: 1248,

      total_teachers: 86,

      total_prestasi: 320,

      total_ruang: 36,

    },

  };

}



export function mapSettingsToProfile(

  settings: Record<string, Record<string, string>>

): import("@/types/public").SchoolProfile {

  const g = settings.general ?? {};

  const p = settings.profile ?? {};

  const s = settings.social ?? {};



  const missionRaw = p.school_mission ?? schoolInfo.principal.mission.join("\n");



  return {

    name: g.school_name ?? schoolInfo.name,

    tagline: g.school_tagline ?? schoolInfo.tagline,

    address: g.school_address ?? schoolInfo.address,

    phone: g.school_phone ?? schoolInfo.phone,

    email: g.school_email ?? schoolInfo.email,

    hours: g.school_hours ?? schoolInfo.hours,

    principalName: p.principal_name ?? schoolInfo.principal.name,

    principalTitle: p.principal_title ?? schoolInfo.principal.title,

    principalGreeting: p.principal_greeting ?? schoolInfo.principal.greeting,

    principalVision: p.school_vision ?? schoolInfo.principal.vision,

    principalMission: String(missionRaw)

      .split("\n")

      .map((m) => m.trim())

      .filter(Boolean),

    accreditation: p.school_accreditation ?? schoolInfo.principal.accreditation,

    logoUrl: g.school_logo
      ? normalizeMediaUrl(g.school_logo) ?? g.school_logo
      : undefined,

    heroImageUrl: g.hero_image
      ? normalizeMediaUrl(g.hero_image) ?? g.hero_image
      : undefined,

    orgChartImageUrl: g.org_chart_image
      ? normalizeMediaUrl(g.org_chart_image) ?? g.org_chart_image
      : undefined,

    orgChartTitle: g.org_chart_title ?? "Struktur Organisasi",

    principalPhotoUrl: p.principal_photo
      ? normalizeMediaUrl(p.principal_photo) ?? p.principal_photo
      : schoolInfo.principal.photo,

    social: [

      { label: "Instagram", href: s.instagram_url ?? socialLinks[0].href },

      { label: "YouTube", href: s.youtube_url ?? socialLinks[1].href },

      { label: "Facebook", href: s.facebook_url ?? socialLinks[2].href },

      { label: "TikTok", href: s.tiktok_url ?? socialLinks[3].href },

    ],

  };

}



export function flattenGalleryImages(

  galleries: PublicHomeData["galleries"],
  limit?: number,

): import("@/types/public").GalleryDisplayImage[] {

  const spans = [

    "col-span-2 row-span-2",

    "col-span-1 row-span-1",

    "col-span-1 row-span-1",

    "col-span-1 row-span-2",

    "col-span-1 row-span-1",

    "col-span-2 row-span-1",

  ];



  const images: import("@/types/public").GalleryDisplayImage[] = [];

  const list = Array.isArray(galleries) ? galleries : [];



  for (const gallery of list) {

    const galleryImages = unwrapList<{

      id: number;

      url: string;

      alt?: string;

    }>(gallery.images);



    for (const img of galleryImages) {

      if (!img?.url) continue;

      images.push({

        id: img.id,

        src: img.url,

        alt: img.alt ?? gallery.title,

        span: spans[images.length % spans.length] ?? "col-span-1 row-span-1",

      });

      if (limit && images.length >= limit) return images;

    }

  }



  return images;

}



export function mapSettingsToAchievements(
  settings: Record<string, Record<string, string>>,
  achievements: AchievementItem[] = [],
): import("@/types/public").AchievementSectionData {
  const a = settings.achievements ?? {};

  const counters = [1, 2, 3].map((n) => ({
    value: Number(a[`achievements_counter_${n}_value`]) || fallbackCounters[n - 1]?.value || 0,
    label:
      a[`achievements_counter_${n}_label`] ??
      fallbackCounters[n - 1]?.label ??
      `Prestasi ${n}`,
  }));

  const items =
    achievements.length > 0
      ? achievements.map((item) => ({
          title: item.title,
          year: item.year,
          level: item.level,
        }))
      : useDemoContent
        ? fallbackAchievements
        : [];

  return {
    badge: a.achievements_badge ?? "Prestasi",
    title: a.achievements_title ?? "Prestasi Sekolah",
    subtitle:
      a.achievements_subtitle ??
      "Kebanggaan MAN 2 Madiun di tingkat kota, provinsi, hingga nasional.",
    counters,
    items,
  };
}

export function mapSettingsToFaqs(
  settings: Record<string, Record<string, string>>,
  faqs: FaqItem[] = [],
): import("@/types/public").FaqSectionData {
  const f = settings.faq ?? {};

  const items =
    faqs.length > 0
      ? faqs.map((item) => ({
          question: item.question,
          answer: item.answer,
          category: item.category,
        }))
      : useDemoContent
        ? fallbackFaqs
        : [];

  return {
    badge: f.faq_badge ?? "FAQ",
    title: f.faq_title ?? "Pertanyaan yang Sering Diajukan",
    subtitle:
      f.faq_subtitle ??
      "Jawaban untuk pertanyaan umum seputar pendaftaran, kegiatan belajar, dan layanan madrasah.",
    items,
  };
}

export function mapSettingsToTestimonials(
  settings: Record<string, Record<string, string>>,
  testimonials: TestimonialItem[] = [],
): import("@/types/public").TestimonialSectionData {
  const t = settings.testimonials ?? {};

  const items =
    testimonials.length > 0
      ? testimonials.map((item) => ({
          name: item.name,
          graduationYear: item.graduation_year,
          occupation: item.occupation,
          quote: item.quote,
          photoUrl: item.photo_url,
        }))
      : useDemoContent
        ? fallbackTestimonials
        : [];

  return {
    badge: t.testimonials_badge ?? "Testimoni Alumni",
    title: t.testimonials_title ?? "Suara Alumni MAN 2 Madiun",
    subtitle:
      t.testimonials_subtitle ??
      "Cerita inspiratif dari alumni yang telah melanjutkan perjalanan di berbagai bidang.",
    items,
  };
}

export function mapSettingsToIntegrityZone(
  settings: Record<string, Record<string, string>>,
): import("@/types/public").IntegrityZoneData {
  const i = settings.integrity ?? {};

  const commitments = String(i.integrity_commitments ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    badge: i.integrity_badge ?? "Zona Integritas",
    title: i.integrity_title ?? "Zona Integritas MAN 2 Kota Madiun",
    subtitle:
      i.integrity_subtitle ??
      "Komitmen kami mewujudkan layanan pendidikan yang bersih, transparan, dan bebas dari korupsi.",
    description:
      i.integrity_description ??
      "MAN 2 Kota Madiun berkomitmen menerapkan Zona Integritas (ZI) di lingkungan madrasah.",
    commitments: commitments.length
      ? commitments
      : [
          "Menolak gratifikasi dan pemberian terkait jabatan",
          "Menjaga kerahasiaan dokumen dan data madrasah",
          "Tidak mempergunakan fasilitas kantor untuk kepentingan pribadi",
        ],
    contactLabel: i.integrity_contact_label ?? "Lapor Pelanggaran Integritas",
    contactEmail: i.integrity_contact_email ?? "zi@man2madiun.sch.id",
    contactPhone: i.integrity_contact_phone ?? "",
    imageUrl: i.integrity_image
      ? normalizeMediaUrl(i.integrity_image) ?? i.integrity_image
      : undefined,
  };
}

