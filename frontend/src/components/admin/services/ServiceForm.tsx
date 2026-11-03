"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField, inputClass, textareaClass, selectClass } from "@/components/admin/ui/FormField";
import type { ServiceItem } from "@/types/api";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
  url: z.string().optional(),
  sort_order: z.number().min(0),
  is_active: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof schema>;

const iconOptions = [
  "clipboard-list",
  "graduation-cap",
  "monitor",
  "laptop",
  "book-open",
  "library",
];

export function ServiceForm({
  initial,
  onSubmit,
  submitLabel = "Simpan",
}: {
  initial?: ServiceItem;
  onSubmit: (v: ServiceFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      icon: initial?.icon ?? "clipboard-list",
      url: initial?.url ?? "",
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <FormField label="Judul" error={errors.title?.message} required>
        <input className={inputClass} {...register("title")} />
      </FormField>
      <FormField label="Deskripsi">
        <textarea className={textareaClass} {...register("description")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Icon">
          <select className={selectClass} {...register("icon")}>
            {iconOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Urutan">
          <input
            type="number"
            className={inputClass}
            {...register("sort_order", { valueAsNumber: true })}
          />
        </FormField>
      </div>
      <FormField label="URL">
        <input className={inputClass} placeholder="https://..." {...register("url")} />
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_active")} />
        Aktif
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 font-semibold text-white"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
