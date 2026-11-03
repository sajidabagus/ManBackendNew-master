"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewsForm, type NewsFormValues } from "@/components/admin/news/NewsForm";
import { fetchNewsItem, updateNews } from "@/lib/api/news";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { NewsItem } from "@/types/api";

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNewsItem(id).then(setItem).catch(() => router.push("/admin/news"));
  }, [id, router]);

  const handleSubmit = async (values: NewsFormValues, thumbnail?: File) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== "") fd.append(k, String(v));
    });
    if (thumbnail) fd.append("thumbnail", thumbnail);
    try {
      await updateNews(id, fd);
      router.push("/admin/news");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader title="Edit Berita" backHref="/admin/news" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <NewsForm initial={item} onSubmit={handleSubmit} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
