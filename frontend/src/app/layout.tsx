import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  fetchPublicHome,
  mapSettingsToProfile,
} from "@/lib/api/public-server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

function iconTypeFromUrl(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "image/png";
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPublicHome();
  const profile = mapSettingsToProfile(data.settings ?? {});
  const logoUrl = profile.logoUrl;
  const icons = logoUrl
    ? {
        icon: [{ url: logoUrl, type: iconTypeFromUrl(logoUrl) }],
        apple: [{ url: logoUrl }],
        shortcut: logoUrl,
      }
    : undefined;

  return {
    title: {
      default: "MAN 2 Kota Madiun",
      template: "%s | MAN 2 Kota Madiun",
    },
    description:
      "Website resmi MAN 2 Kota Madiun — Madrasah Aliyah Negeri unggulan dengan konsep pendidikan digital modern, akreditasi A, dan layanan PTSP, PPDB, E-Learning terintegrasi.",
    keywords: [
      "MAN 2 Madiun",
      "Madrasah Aliyah",
      "PPDB Madiun",
      "Madrasah Digital",
      "Sekolah Islam Madiun",
    ],
    authors: [{ name: "MAN 2 Kota Madiun" }],
    icons,
    openGraph: {
      type: "website",
      locale: "id_ID",
      title: "MAN 2 Kota Madiun",
      description:
        "Madrasah digital modern berprestasi dengan layanan pendidikan terintegrasi.",
      siteName: "MAN 2 Kota Madiun",
      ...(logoUrl ? { images: [{ url: logoUrl, alt: "Logo MAN 2 Kota Madiun" }] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
