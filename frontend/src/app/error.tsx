"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center dark:bg-secondary-dark">
      <h1 className="font-display text-2xl font-bold text-secondary-dark dark:text-white">
        Terjadi kesalahan
      </h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-teal-300">
        Halaman tidak dapat dimuat. Pastikan backend API berjalan di port 8000.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white dark:border-teal-800 dark:text-teal-200"
        >
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
