"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2 } from "lucide-react";
import {
  FormField,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/admin/ui/FormField";
import { ImageDropzone } from "@/components/admin/ui/ImageDropzone";
import type { GalleryItem, GalleryImage } from "@/types/api";

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export type GalleryFormValues = z.infer<typeof schema>;

interface GalleryFormProps {
  initial?: GalleryItem;
  existingImages?: GalleryImage[];
  onSubmit: (values: GalleryFormValues, images: File[]) => Promise<void>;
  onDeleteImage?: (imageId: number) => Promise<void>;
  submitLabel?: string;
}

export function GalleryForm({
  initial,
  existingImages = [],
  onSubmit,
  onDeleteImage,
  submitLabel = "Simpan",
}: GalleryFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState(existingImages);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      status: initial?.status ?? "draft",
    },
  });

  const processSubmit = async (values: GalleryFormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(values, images);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-5">
      <FormField label="Judul Album" error={errors.title?.message} required>
        <input className={inputClass} {...register("title")} />
      </FormField>

      <FormField label="Deskripsi">
        <textarea
          className={textareaClass}
          rows={3}
          {...register("description")}
        />
      </FormField>

      <FormField label="Status" required>
        <select className={selectClass} {...register("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </FormField>

      <FormField label="Upload Gambar" required={!initial}>
        <ImageDropzone multiple value={images} onChange={setImages} />
      </FormField>

      {existing.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-600">
            Gambar existing
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {existing.map((img) => (
              <div key={img.id} className="group relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="h-full w-full rounded-2xl object-cover ring-1 ring-slate-200"
                />
                {onDeleteImage && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onDeleteImage(img.id);
                      setExisting((prev) => prev.filter((i) => i.id !== img.id));
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
