import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { PrincipalWelcome } from "@/components/sections/PrincipalWelcome";
import { DigitalServices } from "@/components/sections/DigitalServices";
import { News } from "@/components/sections/News";
import { Achievements } from "@/components/sections/Achievements";
import { Gallery } from "@/components/sections/Gallery";
import { AlumniTestimonials } from "@/components/sections/AlumniTestimonials";
import { FAQ } from "@/components/sections/FAQ";
import { IntegrityZone } from "@/components/sections/IntegrityZone";
import {
  fetchPublicHome,
  flattenGalleryImages,
  mapSettingsToAchievements,
  mapSettingsToFaqs,
  mapSettingsToIntegrityZone,
  mapSettingsToProfile,
  mapSettingsToTestimonials,
} from "@/lib/api/public-server";
import type { StatItemData } from "@/lib/data";

const Navbar = dynamic(
  () => import("@/components/layout/Navbar").then((m) => ({ default: m.Navbar })),
  { ssr: true }
);

export const revalidate = 0;

export default async function HomePage() {
  const data = await fetchPublicHome();
  const profile = mapSettingsToProfile(data.settings ?? {});
  const achievementsSection = mapSettingsToAchievements(
    data.settings ?? {},
    data.achievements ?? [],
  );
  const testimonialsSection = mapSettingsToTestimonials(
    data.settings ?? {},
    data.testimonials ?? [],
  );
  const faqSection = mapSettingsToFaqs(data.settings ?? {}, data.faqs ?? []);
  const integritySection = mapSettingsToIntegrityZone(data.settings ?? {});
  const galleryImages = flattenGalleryImages(data.galleries ?? [], 6);

  const statItems: StatItemData[] = [
    { label: "Siswa Aktif", value: data.stats.total_students, icon: "users" },
    {
      label: "Tenaga Pendidik",
      value: data.stats.total_teachers,
      icon: "graduation-cap",
    },
    {
      label: "Prestasi",
      value: data.stats.total_prestasi,
      suffix: "+",
      icon: "trophy",
    },
    { label: "Ruang Kelas", value: data.stats.total_ruang, icon: "building" },
  ];

  const displayGallery = galleryImages;

  return (
    <>
      <Navbar
        schoolName={profile.name}
        tagline="Madrasah Digital"
        logoUrl={profile.logoUrl}
      />
      <main>
        <Hero
          tagline={profile.tagline}
          schoolName={profile.name}
          heroImage={profile.heroImageUrl}
        />
        <Statistics stats={statItems} />
        <PrincipalWelcome profile={profile} />
        <DigitalServices services={data.services} />
        <News items={data.news} />
        <Achievements section={achievementsSection} />
        <Gallery images={displayGallery} />
        <AlumniTestimonials section={testimonialsSection} />
        <FAQ section={faqSection} />
        <IntegrityZone section={integritySection} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
