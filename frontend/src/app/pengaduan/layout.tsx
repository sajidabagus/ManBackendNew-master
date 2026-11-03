import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  fetchPublicHome,
  mapSettingsToProfile,
} from "@/lib/api/public-server";

export const metadata = {
  title: "Layanan Pengaduan",
  description:
    "Layanan pengaduan resmi MAN 2 Kota Madiun untuk siswa, orang tua, guru, dan masyarakat.",
};

export default async function PengaduanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const home = await fetchPublicHome();
  const profile = mapSettingsToProfile(home.settings);

  return (
    <>
      <Navbar
        schoolName={profile.name}
        tagline="Madrasah Digital"
        logoUrl={profile.logoUrl}
      />
      <main className="min-h-screen bg-slate-50 pt-24 dark:bg-secondary-dark">
        {children}
      </main>
      <Footer profile={profile} />
    </>
  );
}
