import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { newsItems as fallbackNews } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import type { NewsItem } from "@/types/api";
import { normalizeMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";

const categoryColors: Record<string, string> = {
  Prestasi: "bg-accent/15 text-accent-dark",
  Teknologi: "bg-primary/15 text-primary",
  Kegiatan: "bg-teal-100 text-teal-800 dark:bg-teal-800/50 dark:text-teal-200",
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface NewsProps {
  items?: NewsItem[];
}

export function News({ items }: NewsProps) {
  const fromApi = items && items.length > 0;
  const displayItems = fromApi
    ? items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt ?? "",
        category: item.category?.name ?? "Berita",
        date: formatDate(item.published_at ?? item.created_at),
        image: normalizeMediaUrl(item.thumbnail_url) ?? PLACEHOLDER_IMAGE,
      }))
    : process.env.NODE_ENV !== "production"
      ? fallbackNews.map((n) => ({
          id: n.id,
          slug: String(n.id),
          title: n.title,
          excerpt: n.excerpt,
          category: n.category,
          date: n.date,
          image: n.image,
        }))
      : [];

  return (
    <section id="berita" className="section-padding bg-slate-50 dark:bg-teal-950/40">
      <div className="container-custom">
        <SectionHeading
          badge="Berita"
          title="Berita Terbaru"
          subtitle="Informasi dan update terkini dari MAN 2 Kota Madiun."
        />

        {displayItems.length === 0 ? (
          <p className="text-center text-sm text-slate-500 dark:text-teal-300/70">
            Belum ada berita published. Publish berita di admin agar tampil di sini.
          </p>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayItems.map((item, i) => (
            <FadeIn key={item.id} delay={i * 80}>
              <article className="group overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg dark:bg-teal-950/80 dark:ring-1 dark:ring-teal-800/40">
                <Link href={`/berita/${item.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized={shouldUnoptimizeMedia(item.image)}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[item.category] ?? categoryColors.Kegiatan}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-teal-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </div>
                    <h3 className="font-display text-lg font-bold leading-snug text-secondary-dark transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-teal-300">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-teal-300/70">
                      {item.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-teal-300">
                      Baca selengkapnya
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
        )}

        <FadeIn className="mt-10 text-center" delay={200}>
          <Button href="/berita" variant="secondary" size="lg">
            Lihat Semua Berita
            <ArrowRight className="h-5 w-5" />
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
