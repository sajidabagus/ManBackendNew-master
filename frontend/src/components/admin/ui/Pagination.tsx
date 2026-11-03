"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginatedMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-teal-800/50 dark:bg-teal-950/40">
      <p className="text-sm text-slate-500 dark:text-teal-400">
        Halaman {meta.current_page} dari {meta.last_page} ({meta.total} data)
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
          className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-teal-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
          className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-teal-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
