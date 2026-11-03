import type { NextConfig } from "next";
import path from "path";

function storageHostPatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [];

  for (const raw of [
    process.env.NEXT_PUBLIC_STORAGE_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ]) {
    if (!raw) continue;
    try {
      const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const u = new URL(href);
      patterns.push({
        protocol: u.protocol === "http:" ? "http" : "https",
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/storage/**",
      });
    } catch {
      /* ignore invalid env URL */
    }
  }

  patterns.push(
    { protocol: "https", hostname: "**", pathname: "/storage/**" },
    { protocol: "http", hostname: "**", pathname: "/storage/**" },
  );

  return patterns;
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "react-hook-form",
      "zod",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      ...storageHostPatterns(),
    ],
  },
};

export default nextConfig;
