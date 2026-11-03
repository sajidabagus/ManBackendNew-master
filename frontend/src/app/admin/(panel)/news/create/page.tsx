"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewsForm, type NewsFormValues } from "@/components/admin/news/NewsForm";
import { createNews } from "@/lib/api/news";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateNewsPage() {
  const router = useRouter();

  const handleSubmit = async (values: NewsFormValues, thumbnail?: File) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== "") fd.append(k, String(v));
    });
    if (thumbnail) fd.append("thumbnail", thumbnail);
    try {
      await createNews(fd);
      router.push("/admin/news");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Tambah Berita"
        backHref="/admin/news"
        description="Buat artikel baru"
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <NewsForm onSubmit={handleSubmit} submitLabel="Publish / Simpan" />
      </div>
    </div>
  );
}
