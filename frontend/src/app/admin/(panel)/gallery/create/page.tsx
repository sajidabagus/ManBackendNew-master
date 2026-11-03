"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  GalleryForm,
  type GalleryFormValues,
} from "@/components/admin/gallery/GalleryForm";
import { createGallery } from "@/lib/api/gallery";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateGalleryPage() {
  const router = useRouter();

  const handleSubmit = async (values: GalleryFormValues, images: File[]) => {
    const fd = new FormData();
    fd.append("title", values.title);
    if (values.description) fd.append("description", values.description);
    fd.append("status", values.status);
    images.forEach((file, i) => fd.append(`images[${i}]`, file));

    try {
      await createGallery(fd);
      router.push("/admin/gallery");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Tambah Galeri"
        backHref="/admin/gallery"
        description="Upload multiple foto sekaligus"
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <GalleryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
