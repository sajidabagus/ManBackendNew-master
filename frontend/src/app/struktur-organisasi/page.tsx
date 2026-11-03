import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Network } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { shouldUnoptimizeMedia } from "@/lib/media-url";
import {
  fetchPublicHome,
  mapSettingsToProfile,
} from "@/lib/api/public-server";

export const revalidate = 0;

export const metadata = {
  title: "Struktur Organisasi",
  description:
    "Struktur organisasi MAN 2 Kota Madiun — bagan pimpinan, wakil, dan unit kerja madrasah.",
};

export default async function OrganizationStructurePage() {
  const home = await fetchPublicHome();
  const profile = mapSettingsToProfile(home.settings ?? {});
  const title = profile.orgChartTitle ?? "Struktur Organisasi";
  const imageUrl = profile.orgChartImageUrl;

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
            href="/#profil"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Profil
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Profil
            </p>
            <h1 className="font-display text-3xl font-bold text-secondary-dark dark:text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-teal-200">
              Bagan struktur organisasi {profile.name}.
            </p>
          </div>

          {imageUrl ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-soft dark:border-teal-800/50 dark:bg-teal-950/40 sm:p-6">
              <Image
                src={imageUrl}
                alt={title}
                width={1600}
                height={1200}
                className="mx-auto h-auto w-full max-w-5xl object-contain"
                unoptimized={shouldUnoptimizeMedia(imageUrl)}
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-teal-800 dark:bg-teal-950/40">
              <Network className="mb-4 h-10 w-10 text-slate-400" />
              <p className="font-medium text-slate-700 dark:text-teal-100">
                Gambar struktur organisasi belum diunggah.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-teal-400">

              </p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
