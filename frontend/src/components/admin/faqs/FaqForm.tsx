"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField, inputClass, selectClass, textareaClass } from "@/components/admin/ui/FormField";
import type { FaqItem } from "@/types/api";

const schema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  answer: z.string().min(10, "Jawaban minimal 10 karakter"),
  category: z.string().optional(),
  sort_order: z.number().min(0),
  is_active: z.boolean(),
});

export type FaqFormValues = z.infer<typeof schema>;

const categoryOptions = ["Umum", "PPDB", "Akademik", "Ekstrakurikuler", "Lainnya"];

export function FaqForm({
  initial,
  onSubmit,
  submitLabel = "Simpan",
}: {
  initial?: FaqItem;
  onSubmit: (v: FaqFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: initial?.question ?? "",
      answer: initial?.answer ?? "",
      category: initial?.category ?? "Umum",
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <FormField label="Pertanyaan" error={errors.question?.message} required>
        <input className={inputClass} {...register("question")} />
      </FormField>
      <FormField label="Jawaban" error={errors.answer?.message} required>
        <textarea className={textareaClass} rows={5} {...register("answer")} />
      </FormField>
      <FormField label="Kategori">
        <select className={selectClass} {...register("category")}>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
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
