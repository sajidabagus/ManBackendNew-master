"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField, inputClass, selectClass } from "@/components/admin/ui/FormField";
import type { AchievementItem } from "@/types/api";

const schema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  year: z.number().min(1900).max(2100),
  level: z.string().min(1, "Kategori wajib diisi"),
  sort_order: z.number().min(0),
  is_active: z.boolean(),
});

export type AchievementFormValues = z.infer<typeof schema>;

const levelOptions = [
  "Nasional",
  "Provinsi",
  "Kabupaten",
  "Kota",
  "BAN-S/M",
  "Lainnya",
];

export function AchievementForm({
  initial,
  onSubmit,
  submitLabel = "Simpan",
}: {
  initial?: AchievementItem;
  onSubmit: (v: AchievementFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      year: initial?.year ?? new Date().getFullYear(),
      level: initial?.level ?? "Nasional",
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <FormField label="Judul Prestasi" error={errors.title?.message} required>
        <input className={inputClass} {...register("title")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Tahun" error={errors.year?.message} required>
          <input
            type="number"
            className={inputClass}
            {...register("year", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Kategori / Tingkat" error={errors.level?.message} required>
          <select className={selectClass} {...register("level")}>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Urutan">
        <input
          type="number"
          className={inputClass}
          {...register("sort_order", { valueAsNumber: true })}
        />
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_active")} />
        Tampilkan di website
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
