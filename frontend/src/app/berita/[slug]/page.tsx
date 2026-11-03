import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  fetchPublicHome,
  fetchPublicNews,
  mapSettingsToProfile,
} from "@/lib/api/public-server";
import { shouldUnoptimizeMedia } from "@/lib/media-url";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [home, article] = await Promise.all([
    fetchPublicHome(),
    fetchPublicNews(slug),
  ]);

  if (!article) notFound();

  const profile = mapSettingsToProfile(home.settings);

  return (
    <>
      <Navbar schoolName={profile.name} tagline="Madrasah Digital" />
      <main className="min-h-screen bg-white pt-24 dark:bg-secondary-dark">
        <article className="container-custom max-w-4xl px-4 pb-16">
          <Link
            href="/berita"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Semua Berita
          </Link>

          {article.category && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {article.category.name}
            </span>
          )}

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-secondary-dark dark:text-white md:text-4xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-teal-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })
                : "—"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views} views
            </span>
          </div>

          {article.thumbnail_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                unoptimized={shouldUnoptimizeMedia(article.thumbnail_url)}
              />
            </div>
          )}

          {article.excerpt && (
            <p className="mt-8 text-lg font-medium text-slate-600 dark:text-teal-200">
              {article.excerpt}
            </p>
          )}

          <div
            className="article-content mt-8"
            dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
          />
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
