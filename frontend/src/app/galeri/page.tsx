import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import {
  fetchPublicGalleries,
  fetchPublicHome,
  flattenGalleryImages,
  mapSettingsToProfile,
} from "@/lib/api/public-server";

export const revalidate = 0;

export const metadata = {
  title: "Galeri",
  description:
    "Galeri foto kegiatan, prestasi, dan kehidupan madrasah MAN 2 Kota Madiun.",
};

export default async function GalleryPage() {
  const [home, galleries] = await Promise.all([
    fetchPublicHome(),
    fetchPublicGalleries(),
  ]);
  const profile = mapSettingsToProfile(home.settings ?? {});
  const images = flattenGalleryImages(galleries);

  return (
    <>
      <Navbar
        schoolName={profile.name}
        tagline="Madrasah Digital"
        logoUrl={profile.logoUrl}
      />
      <main className="min-h-screen bg-slate-50 pt-24 dark:bg-secondary-dark">
        <div className="container-custom section-padding">
          <Link
            href="/#galeri"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Galeri
            </p>
            <h1 className="font-display text-3xl font-bold text-secondary-dark dark:text-white sm:text-4xl">
              Semua Foto Kegiatan
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-teal-200">
              {images.length > 0
                ? `${images.length} foto dari kegiatan ${profile.name}.`
                : `Belum ada foto galeri yang dipublikasikan.`}
            </p>
          </div>

          {images.length > 0 ? (
            <GalleryGrid images={images} layout="uniform" />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-teal-800 dark:bg-teal-950/40">
              <Images className="mb-4 h-10 w-10 text-slate-400" />
              <p className="font-medium text-slate-700 dark:text-teal-100">
                Belum ada foto yang ditampilkan.
              </p>
              <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-teal-400">
                Pastikan album galeri di admin berstatus Terbit (published),
                bukan Draf.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
