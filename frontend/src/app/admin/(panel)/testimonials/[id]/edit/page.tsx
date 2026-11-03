"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/admin/testimonials/TestimonialForm";
import { fetchTestimonial, updateTestimonial } from "@/lib/api/testimonials";
import { appendFormValues } from "@/lib/api/form-data";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { TestimonialItem } from "@/types/api";

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<TestimonialItem | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchTestimonial(id)
      .then(setItem)
      .catch(() => router.replace("/admin/testimonials"));
  }, [id, router]);

  const handleSubmit = async (values: TestimonialFormValues, photo?: File) => {
    const fd = new FormData();
    appendFormValues(fd, values);
    if (photo) fd.append("photo", photo);
    try {
      await updateTestimonial(id, fd);
      router.push("/admin/testimonials");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader title="Edit Testimoni" backHref="/admin/testimonials" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <TestimonialForm initial={item} onSubmit={handleSubmit} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
