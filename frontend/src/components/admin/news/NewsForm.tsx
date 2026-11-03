"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  FormField,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/admin/ui/FormField";

const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/ui/RichTextEditor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-teal-900/40" />
    ),
  }
);
import { fetchNewsCategories } from "@/lib/api/news";
import type { NewsCategory, NewsItem } from "@/types/api";

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  news_category_id: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export type NewsFormValues = z.infer<typeof schema>;

interface NewsFormProps {
  initial?: NewsItem;
  onSubmit: (values: NewsFormValues, thumbnail?: File) => Promise<void>;
  submitLabel?: string;
}

export function NewsForm({
  initial,
  onSubmit,
  submitLabel = "Simpan",
}: NewsFormProps) {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      news_category_id: initial?.category?.id?.toString() ?? "",
      status: initial?.status ?? "draft",
    },
  });

  useEffect(() => {
    fetchNewsCategories().then(setCategories).catch(console.error);
  }, []);

  const processSubmit = async (values: NewsFormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(values, thumbnail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Judul" error={errors.title?.message} required>
          <input className={inputClass} {...register("title")} />
        </FormField>
        <FormField label="Kategori">
          <select className={selectClass} {...register("news_category_id")}>
            <option value="">— Pilih kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Ringkasan">
        <textarea className={textareaClass} rows={2} {...register("excerpt")} />
      </FormField>

      <FormField label="Konten">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Status" required>
          <select className={selectClass} {...register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
        <FormField label="Thumbnail">
          {initial?.thumbnail_url && !thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={initial.thumbnail_url}
              alt=""
              className="mb-2 h-24 rounded-xl object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className={inputClass}
            onChange={(e) => setThumbnail(e.target.files?.[0])}
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
