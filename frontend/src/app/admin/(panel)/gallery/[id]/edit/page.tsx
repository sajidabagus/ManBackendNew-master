"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  GalleryForm,
  type GalleryFormValues,
} from "@/components/admin/gallery/GalleryForm";
import {
  fetchGallery,
  updateGallery,
  deleteGalleryImage,
} from "@/lib/api/gallery";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { GalleryItem } from "@/types/api";

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery(id).then(setItem).catch(() => router.push("/admin/gallery"));
  }, [id, router]);

  const handleSubmit = async (values: GalleryFormValues, images: File[]) => {
    const fd = new FormData();
    fd.append("title", values.title);
    if (values.description) fd.append("description", values.description);
    fd.append("status", values.status);
    images.forEach((file, i) => fd.append(`images[${i}]`, file));

    try {
      await updateGallery(id, fd);
      router.push("/admin/gallery");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader title="Edit Galeri" backHref="/admin/gallery" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <GalleryForm
          initial={item}
          existingImages={item.images}
          onSubmit={handleSubmit}
          onDeleteImage={async (imageId) => {
            await deleteGalleryImage(id, imageId);
          }}
          submitLabel="Perbarui"
        />
      </div>
    </div>
  );
}
