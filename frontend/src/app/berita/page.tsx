import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { shouldUnoptimizeMedia } from "@/lib/media-url";
import {
  fetchPublicHome,
  mapSettingsToProfile,
} from "@/lib/api/public-server";

import { fetchPublicJson } from "@/lib/api/public-base";

async function fetchAllNews() {
  const json = await fetchPublicJson("/public/news?per_page=50");
  if (!json || typeof json !== "object") return [];
  const data = (json as { data?: unknown }).data;
  return Array.isArray(data) ? data : [];
}

export const revalidate = 60;

export default async function BeritaListPage() {
  const [home, news] = await Promise.all([fetchPublicHome(), fetchAllNews()]);
  const profile = mapSettingsToProfile(home.settings);

  return (
    <>
      <Navbar schoolName={profile.name} tagline="Madrasah Digital" />
      <main className="min-h-screen bg-slate-50 pt-24 dark:bg-secondary-dark">
        <div className="container-custom section-padding">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <h1 className="font-display text-3xl font-bold text-secondary-dark dark:text-white">
            Semua Berita
          </h1>
          <p className="mt-2 text-slate-600 dark:text-teal-300">
            Informasi dan update dari {profile.name}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map(
              (item: {
                id: number;
                slug: string;
                title: string;
                excerpt?: string;
                thumbnail_url?: string;
                published_at?: string;
                category?: { name: string };
              }) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-soft-lg dark:bg-teal-950/80"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={
                        item.thumbnail_url ??
                        "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
                      }
                      alt={item.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      unoptimized={shouldUnoptimizeMedia(item.thumbnail_url)}
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString("id-ID")
                        : "—"}
                    </div>
                    <h2 className="font-display font-bold text-secondary-dark group-hover:text-primary dark:text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>

          {news.length === 0 && (
            <p className="mt-8 text-center text-slate-500">
              Belum ada berita published.
            </p>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
