"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField, inputClass, textareaClass } from "@/components/admin/ui/FormField";
import type { TestimonialItem } from "@/types/api";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  graduation_year: z.number().min(1900).max(2100).optional().nullable(),
  occupation: z.string().optional(),
  quote: z.string().min(10, "Testimoni minimal 10 karakter"),
  sort_order: z.number().min(0),
  is_active: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof schema>;

export function TestimonialForm({
  initial,
  onSubmit,
  submitLabel = "Simpan",
}: {
  initial?: TestimonialItem;
  onSubmit: (v: TestimonialFormValues, photo?: File) => Promise<void>;
  submitLabel?: string;
}) {
  const [photo, setPhoto] = useState<File | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      graduation_year: initial?.graduation_year ?? new Date().getFullYear(),
      occupation: initial?.occupation ?? "",
      quote: initial?.quote ?? "",
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit(v, photo))}
      className="max-w-2xl space-y-4"
    >
      <FormField label="Nama Alumni" error={errors.name?.message} required>
        <input className={inputClass} {...register("name")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Tahun Lulus">
          <input
            type="number"
            className={inputClass}
            {...register("graduation_year", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Pekerjaan / Jurusan">
          <input className={inputClass} {...register("occupation")} />
        </FormField>
      </div>
      <FormField label="Testimoni" error={errors.quote?.message} required>
        <textarea className={textareaClass} rows={5} {...register("quote")} />
      </FormField>
      <FormField label="Foto Alumni">
        {initial?.photo_url && !photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initial.photo_url}
            alt={initial.name}
            className="mb-2 h-32 w-32 rounded-full object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          className={inputClass}
          onChange={(e) => setPhoto(e.target.files?.[0])}
        />
      </FormField>
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
